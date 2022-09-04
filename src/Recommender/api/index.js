"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.getFeatures = exports.getArtists = exports.getAvailableGenres = exports.getToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
dotenv_1.default.config();
const AUTHURL = process.env.SPOTIFY_AUTH_URL;
const APIURL = process.env.SPOTIFY_API_URL;
const getToken = () => axios_1.default.post(`${AUTHURL}`, qs_1.default.stringify({ grant_type: "client_credentials" }), {
    headers: {
        "content-type": "application/x-www-form-urlencoded",
    },
    auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
    },
});
exports.getToken = getToken;
const getAvailableGenres = function () {
    return axios_1.default.get(`${APIURL}/recommendations/available-genre-seeds`, { headers: { authorization: `Bearer ${this.spotifyToken}` } });
};
exports.getAvailableGenres = getAvailableGenres;
const getArtists = function (ids) {
    return axios_1.default.get(`${APIURL}/artists?${qs_1.default.stringify({ ids })}`, {
        headers: {
            authorization: `Bearer ${this.spotifyToken}`,
        },
    });
};
exports.getArtists = getArtists;
const getFeatures = function (ids) {
    return axios_1.default.get(`${APIURL}/audio-features?${qs_1.default.stringify({ ids })}`, {
        headers: {
            authorization: `Bearer ${this.spotifyToken}`,
        },
    });
};
exports.getFeatures = getFeatures;
const getRecommendations = function (seed) {
    return axios_1.default.get(`${APIURL}/recommendations?${qs_1.default.stringify(Object.assign(Object.assign({}, seed), { market: "KR", limit: 100 }))}`, {
        headers: {
            authorization: `Bearer ${this.spotifyToken}`,
        },
    });
};
exports.getRecommendations = getRecommendations;
