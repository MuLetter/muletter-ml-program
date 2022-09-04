import {
  getArtists,
  getAvailableGenres,
  getRecommendations,
  getToken,
} from "@api";
import { dbConnect, dbDisconnect } from "@models/connect";
import { MailBoxModel } from "@models/MailBox";
import { Artist, MailBox, Track } from "@models/types";
import dotenv from "dotenv";
import { ArtistAndGenres, ProcessAudioFeatures, Seed } from "./types";
import _ from "lodash";
import {
  checkBuildItems,
  dropTrackByLabelCount,
  FeaturesGenerator,
} from "./utils";
import MinMaxScaler from "@minmax-scaler";
import KMeans from "@kmeans";
import RecommenderAdjust from "./adjust";

@RecommenderAdjust
class Recommender {
  mailBox?: MailBox;

  spotifyToken?: string;
  availableGenres?: string[];
  artistAndGenres?: ArtistAndGenres[];
  audioFeatures?: ProcessAudioFeatures[];
  seeds?: Seed[];
  recommendations?: Track[];
  recoAudioFeatures?: ProcessAudioFeatures[];

  // run processing
  kmeans?: KMeans;
  recoIdsAndLabels?: (string | number | undefined)[][];
  recoTracks: Track[];

  MIN_LENGTH: number = 80;
  MAX_LENGTH: number = 100;

  constructor() {
    this.recoTracks = [];
    dotenv.config();
  }

  // db connect
  async open() {
    await dbConnect();
  }

  // db close
  async close() {
    await dbDisconnect();
  }

  // add mailbox
  async addMailBox(id: string) {
    try {
      const mailBox = await MailBoxModel.findById(id);

      if (mailBox) {
        this.mailBox = mailBox;

        const resToken = await getToken();
        this.spotifyToken = resToken.data.access_token;
      } else {
        throw new Error("MailBox Not Found!");
      }
    } catch (err) {
      console.log(this.spotifyToken);
      console.error(err);
    }
  }

  async addAvailableGenres() {
    try {
      const resAvailableGenres = await getAvailableGenres.call(this);
      this.availableGenres = resAvailableGenres.data.genres;
    } catch (err) {
      console.log(this.spotifyToken);
      console.error(err);
    }
  }

  async addArtistAndGenres() {
    try {
      const tracks = this.mailBox?.tracks;
      let artistsIds: Artist[] | string[] = _.uniqBy(
        _.flatten(_.map(tracks, (track) => track.artists)),
        ({ id }) => id
      );
      artistsIds = _.map(artistsIds, ({ id }) => id);
      const chunked = _.chunk(artistsIds, 50);

      for (let chunk of chunked) {
        const ids = _.join(chunk, ",");
        const resGenres = await getArtists.call(this, ids);
        const artists = resGenres.data.artists;

        const artistAndGenres = _.map(artists, (artist) => {
          const _availableGenres = _.filter(artist.genres, (genre) =>
            this.availableGenres?.includes(genre)
          );

          return {
            id: artist.id,
            genres: _availableGenres.length === 0 ? ["pop"] : _availableGenres,
          };
        });

        if (this.artistAndGenres)
          this.artistAndGenres = _.concat(
            this.artistAndGenres,
            artistAndGenres
          ) as any;
        else this.artistAndGenres = artistAndGenres as ArtistAndGenres[];
      }
    } catch (err) {
      console.log(this.spotifyToken);
      console.error(err);
    }
  }

  async addAudioFeatures() {
    try {
      this.audioFeatures = await new FeaturesGenerator(
        this.mailBox!.tracks
      ).generate(this);
    } catch (err) {
      console.log(this.spotifyToken);
      console.error(err);
    }
  }

  async addSeeds() {
    const tracks = this.mailBox?.tracks;
    const artists = this.artistAndGenres;
    const features = this.audioFeatures;

    this.seeds = _.map(tracks, ({ id: trackId, artists: _artists }) => {
      const artistIds = _.map(_artists, ({ id }) => id);
      let genres = _.uniq(
        _.flatten(
          _.map(
            artistIds,
            (artistId) => _.find(artists, ({ id }) => id === artistId)?.genres
          )
        )
      );
      const feature = _.find(this.audioFeatures, ({ id }) => id === trackId);

      // max 5 check
      if (1 + artistIds.length + genres.length > 5) {
        // track, artist 수량에 집중, 장르는 서브템으로
        const availableGenreSize = 5 - (1 + artistIds.length);
        genres = _.sampleSize(genres, availableGenreSize);
      }
      const seedArtists = _.join(artistIds, ",");
      const seedGenres = _.join(genres, ",");

      const seedFeatures = _.reduce(
        Object.keys(feature!),
        (acc, cur) =>
          cur === "id"
            ? acc
            : {
                ...acc,
                [`target_${cur}`]: feature![cur],
              },
        {}
      );

      return {
        seed_tracks: trackId,
        seed_artists: seedArtists,
        seed_genres: seedGenres,
        ...seedFeatures,
      };
    }) as Seed[];
  }

  async addRecommendations() {
    let recommendations: Track[] = [];

    try {
      for (let seed of this.seeds!) {
        const resRecommendations = await getRecommendations.call(this, seed);
        const recos = resRecommendations.data.tracks;
        const parsed = _.map(recos, ({ id, name, artists, album }) => ({
          id,
          name,
          artists: _.map(artists, ({ id, name }) => ({
            id,
            name,
          })),
          album: {
            images: album.images,
          },
        }));

        recommendations = _.concat(recommendations, parsed) as Track[];
      }
    } catch (err) {
      console.log(this.spotifyToken);
      console.error(err);
    }

    this.recommendations = _.uniqBy(recommendations, "id");
  }

  async addRecoAudioFeatures() {
    try {
      this.recoAudioFeatures = await new FeaturesGenerator(
        this.recommendations!
      ).generate(this);
    } catch (err) {
      console.log(this.spotifyToken);
      console.error(err);
    }
  }

  get mergeAudioFeatures() {
    let mergeAudioFeatures = _.concat(
      this.audioFeatures,
      this.recoAudioFeatures
    );

    return _.uniqBy(mergeAudioFeatures, "id");
  }

  get processIds() {
    return _.map(this.mergeAudioFeatures, (feature) => _.values(feature)[0]);
  }

  get processDatas() {
    return _.map(this.mergeAudioFeatures, (feature) =>
      _.tail(_.values(feature))
    );
  }

  run = () => {
    this.runKMeans();
    let recoTracks = this.labelParsing();

    // 수량 조정 - 제거
    let recoIdsAndLabels = this.getRecoIdsAndLabels();
    while (this.recoTracks.length + recoTracks.length > this.MAX_LENGTH) {
      recoTracks = dropTrackByLabelCount(
        recoTracks,
        this.recoAudioFeatures!,
        _.zip.apply(null, recoIdsAndLabels) as any
      );
      // console.log(recoTracks.length);
      recoIdsAndLabels = this.getRecoIdsAndLabels(recoTracks);
    }

    // 수량 조정 - 제거
    this.save(recoTracks);
  };

  save = (recoTracks: Track[]) => {
    this.recoTracks = _.concat(this.recoTracks, recoTracks);
    const recoIds = _.map(recoTracks, ({ id }) => id) as string[];
    this.recommendations = _.filter(
      this.recommendations,
      ({ id }) => !recoIds.includes(id)
    );
    this.recoAudioFeatures = _.filter(
      this.recoAudioFeatures,
      ({ id }) => !recoIds.includes(id)
    );
  };

  // label 있는 track 이어야 함
  getRecoIdsAndLabels = (recoTracks?: Track[]) => {
    if (recoTracks) {
      let recoIdsAndLabels = _.map(recoTracks, ({ id, label }) => [id, label]);
      recoIdsAndLabels = _.unzip(recoIdsAndLabels);
      return recoIdsAndLabels;
    } else {
      const userIds = _.uniq(_.map(this.mailBox?.tracks, ({ id }) => id));
      const trackIdAndLabels = _.zip(this.processIds, this.kmeans!.labels);
      let userIdsAndLabels = _.filter(trackIdAndLabels, ([id]) =>
        _.includes(userIds, id)
      );
      let userLabels = _.uniq(_.unzip(userIdsAndLabels)[1]);

      let recoIdsAndLabels = _.filter(
        trackIdAndLabels,
        ([id, label]) =>
          !_.includes(userIds, id) && _.includes(userLabels, label)
      );
      recoIdsAndLabels = _.unzip(recoIdsAndLabels);

      return recoIdsAndLabels;
    }
  };

  labelParsing = () => {
    let isSaving = false;

    const [recoIds] = this.getRecoIdsAndLabels();

    // recoTracks
    let recoTracks = _.filter(this.recommendations, ({ id }) =>
      recoIds.includes(id)
    );

    // 수량 조정 - 제거
    // if (this.recoTracks.length + recoTracks.length > 50) {
    //   isSaving = false;
    //   return {
    //     isSaving,
    //     recoTracks,
    //   };
    // }

    return recoTracks;
    // if (this.recoTracks.length + recoTracks.length > this.MAX_LENGTH) {
    //   isSaving = false;
    //   return {
    //     isSaving,
    //     recoTracks,
    //   };
    // } else {
    //   isSaving = true;
    //   return {
    //     isSaving,
    //     recoTracks,
    //   };
    // }
    // let recoIdsKeyLabels = _.zipObject(recoIds as string[], recoLabels);
    // recoTracks = _.map(recoTracks, (recoTrack) => ({
    //   ...recoTrack,
    //   label: recoIdsKeyLabels[recoTrack.trackId] as number,
    // }));
    // console.log(recoIdsKeyLabels);
  };

  runKMeans = () => {
    checkBuildItems.call(this);

    // 1. min-max scaling
    const scaler = new MinMaxScaler(this.processDatas as number[][]);
    const datas = scaler.fit().transfrom();

    // 2. KMeans Run
    const kmeans = new KMeans(datas);
    kmeans.setCentroids(2);
    do {
      kmeans.next();
    } while (!kmeans.done);

    this.kmeans = kmeans;
  };

  parsingKMeansLabel = () => {
    const userIds = _.uniq(_.map(this.mailBox?.tracks, ({ id }) => id));
    const trackIdAndLabels = _.zip(this.processIds, this.kmeans!.labels);
    let userIdsAndLabels = _.filter(trackIdAndLabels, ([id]) =>
      _.includes(userIds, id)
    );
    let userLabels = _.uniq(_.unzip(userIdsAndLabels)[1]);
    let recoIdsAndLabels = _.filter(
      trackIdAndLabels,
      ([id, label]) => !_.includes(userIds, id) && _.includes(userLabels, label)
    );

    this.recoIdsAndLabels = recoIdsAndLabels;
  };
}

export default Recommender;
