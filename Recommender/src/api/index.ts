import dotenv from "dotenv";
import axios from "axios";
import qs from "qs";

dotenv.config();

const AUTHURL = process.env.SPOTIFY_AUTH_URL;
const APIURL = process.env.SPOTIFY_API_URL;

export const getToken = () =>
  axios.post(`${AUTHURL}`, qs.stringify({ grant_type: "client_credentials" }), {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.CLIENT_ID!,
      password: process.env.CLIENT_SECRET!,
    },
  });
