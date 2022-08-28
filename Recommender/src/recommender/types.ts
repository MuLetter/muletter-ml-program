import Recommender from "@recommender";

export type Seed = {
  [key: string]: string | number;
  seed_tracks: string;
  seed_artists: string;
  seed_genres: string;
  seed_danceability: number;
  seed_energy: number;
  seed_loudness: number;
  seed_speechiness: number;
  seed_acousticness: number;
  seed_liveness: number;
  seed_valence: number;
  seed_tempo: number;
};

export type NeedAudioFeautres =
  | "id"
  | "danceability"
  | "energy"
  | "loudness"
  | "speechiness"
  | "acousticness"
  | "liveness"
  | "valence"
  | "tempo";

export type ProcessAudioFeatures = {
  [key: string]: string | number;

  id: string;
  danceability: number;
  energy: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  liveness: number;
  valence: number;
  tempo: number;
};

export type PartitionData = {
  data: string;
  groupNum: number;
};

export type ArtistAndGenres = {
  id: string;
  genres: string[];
};

export interface IRecommederAdjust extends Recommender {
  check: () => void;
}
