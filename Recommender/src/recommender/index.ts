import { getArtists, getAvailableGenres, getFeatures, getToken } from "@api";
import { dbConnect, dbDisconnect } from "@models/connect";
import { MailBoxModel } from "@models/MailBox";
import { MailBox } from "@models/types";
import dotenv from "dotenv";
import { ArtistAndGenres, ProcessAudioFeatures } from "./types";
import _ from "lodash";
import { parseNeedFeatures, partition } from "./utils";

class Recommender {
  mailBox?: MailBox;

  spotifyToken?: string;
  availableGenres?: string[];
  artistAndGenres?: ArtistAndGenres[];
  audioFeatures?: ProcessAudioFeatures[];

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
          _.concat(this.artistAndGenres, artistAndGenres);
        else this.artistAndGenres = artistAndGenres as ArtistAndGenres[];

        groupNum++;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async addAudioFeatures() {
    try {
      const trackIds = _.uniq(
        _.map(this.mailBox?.tracks, (track) => track.trackId)
      );
      const partitioned = partition(trackIds, 100);

      let groupNum = 0;
      while (true) {
        const filtered = _.filter(
          partitioned,
          (part) => part.groupNum === groupNum
        );
        if (filtered.length === 0) break;
        const ids = _.map(filtered, (filter) => filter.data).join(",");

        const res = await getFeatures.call(this, ids);
        const audioFeatures = res.data.audio_features;

        // 필요로 하는 것만 parsing
        const processAudioFeatures = _.map(audioFeatures, parseNeedFeatures);
        console.log(processAudioFeatures);

        if (this.audioFeatures)
          _.concat(this.audioFeatures, processAudioFeatures);
        else this.audioFeatures = processAudioFeatures;

        groupNum++;
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default Recommender;
