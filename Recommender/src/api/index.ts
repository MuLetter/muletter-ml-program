import dotenv from "dotenv";
import axios from "axios";
import qs from "qs";
import {
  HasToken,
  ResAvailableGenres,
  ResGenArtists,
  ResGetToken,
} from "./types";

dotenv.config();

const AUTHURL = process.env.SPOTIFY_AUTH_URL;
const APIURL = process.env.SPOTIFY_API_URL;

export const getToken = () =>
  axios.post<ResGetToken>(
    `${AUTHURL}`,
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.CLIENT_ID!,
        password: process.env.CLIENT_SECRET!,
      },
    }
  );

export const getAvailableGenres = function (this: HasToken) {
  return axios.get<ResAvailableGenres>(
    `${APIURL}/recommendations/available-genre-seeds`,
    { headers: { authorization: `Bearer ${this.spotifyToken}` } }
  );
};

export const getArtists = function (this: HasToken, ids: string) {
  return axios.get<ResGenArtists>(
    `${APIURL}/artists?${qs.stringify({ ids })}`,
    {
      headers: {
        authorization: `Bearer ${this.spotifyToken}`,
      },
    }
  );
};
