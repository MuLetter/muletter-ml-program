import {
  getArtists,
  getAvailableGenres,
  getRecommendations,
  getToken,
} from "@api";
import { dbConnect, dbDisconnect } from "@models/connect";
import { MailBoxModel } from "@models/MailBox";
import { MailBox, Track } from "@models/types";
import dotenv from "dotenv";
import { ArtistAndGenres, ProcessAudioFeatures, Seed } from "./types";
import _ from "lodash";
import {
  checkBuildItems,
  FeaturesGenerator,
  parseNeedFeatures,
  partition,
} from "./utils";
import MinMaxScaler from "@minmax-scaler";
import KMeans from "@kmeans";

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

  constructor() {
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
      }
    } catch (err) {
      console.error(err);
    }
  }

  async addAvailableGenres() {
    try {
      const resAvailableGenres = await getAvailableGenres.call(this);
      this.availableGenres = resAvailableGenres.data.genres;
    } catch (err) {
      console.error(err);
    }
  }

  async addArtistAndGenres() {
    try {
      const tracks = this.mailBox?.tracks;
      const artistIds = _.uniq(_.map(tracks, (track) => track.artistIds));
      const partitioned = partition(artistIds, 50);

      let groupNum = 0;
      while (true) {
        const filtered = _.filter(
          partitioned,
          (part) => part.groupNum === groupNum
        );
        if (filtered.length === 0) break;

        const ids = _.map(filtered, (filter) => filter.data).join(",");

        const resGenres = await getArtists.call(this, ids);
        const artists = resGenres.data.artists;

        const artistAndGenres = _.map(artists, (artist) => ({
          id: artist.id,
          genres: _.filter(artist.genres, (genre) =>
            this.availableGenres?.includes(genre)
          ),
        }));

        if (this.artistAndGenres)
          this.artistAndGenres = _.concat(
            this.artistAndGenres,
            artistAndGenres
          ) as any;
        else this.artistAndGenres = artistAndGenres as ArtistAndGenres[];

        groupNum++;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async addAudioFeatures() {
    try {
      this.audioFeatures = await new FeaturesGenerator(
        this.mailBox!.tracks
      ).generate(this);
    } catch (err) {
      console.error(err);
    }
  }

  async addSeeds() {
    const tracks = this.mailBox?.tracks;
    const artists = this.artistAndGenres;
    const features = this.audioFeatures;

    this.seeds = _.map(tracks, (track) => {
      const artist = _.find(artists, (artist) => artist.id === track.artistIds);
      const feature = _.find(
        features,
        (feature) => feature.id === track.trackId
      );
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
        seed_tracks: track.trackId,
        seed_artists: artist?.id,
        seed_genres: artist?.genres.join(","),
        ...seedFeatures,
      };
    }) as any;
  }

  async addRecomendations() {
    let recommendations: Track[] = [];

    try {
      for (let seed of this.seeds!) {
        const resRecommendations = await getRecommendations.call(this, seed);
        const recos = resRecommendations.data.tracks;

        recommendations = _.concat(
          recommendations,
          _.map(recos, (reco) => ({
            trackId: reco.id,
            trackName: reco.name,
            artistIds: _.map(reco.artists, (artist) => artist.id).join(","),
            artistNames: _.map(reco.artists, (artist) => artist.name).join(","),
            image:
              reco.album.images.length === 0 ? "" : reco.album.images[0].url,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }

    this.recommendations = _.uniqBy(recommendations, "trackId");
  }

  async addRecoAudioFeatures() {
    try {
      this.recoAudioFeatures = await new FeaturesGenerator(
        this.recommendations!
      ).generate(this);
    } catch (err) {
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
}

export default Recommender;
