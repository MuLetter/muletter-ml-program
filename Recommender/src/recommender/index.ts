import { getArtists, getAvailableGenres, getToken } from "@api";
import { dbConnect, dbDisconnect } from "@models/connect";
import { MailBoxModel } from "@models/MailBox";
import { MailBox } from "@models/types";
import dotenv from "dotenv";
import { ArtistAndGenres } from "./types";
import _ from "lodash";

class Recommender {
  mailBox?: MailBox;
  spotifyToken?: string;
  availableGenres?: string[];
  artistAndGenres?: ArtistAndGenres[];

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
      const genreParseGroups = _.map(artistIds, (artistId, idx) => ({
        id: artistId,
        parseGroup: Math.floor(idx / 50),
      }));

      let groupNum = 0;
      while (true) {
        const filtered = _.filter(
          genreParseGroups,
          (member) => member.parseGroup === groupNum
        );
        if (filtered.length === 0) break;

        const ids = _.map(filtered, (filter) => filter.id).join(",");

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
}

export default Recommender;
