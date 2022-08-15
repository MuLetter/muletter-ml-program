export type HasToken = {
  spotifyToken?: string;
};

export type ResGetToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export interface ResGenArtists {
  artists: Artist[];
}

export type ResAvailableGenres = {
  genres: string[];
};

export type ResAudioFeatures = {
  audio_features: AudioFeature[];
};

export interface AudioFeature {
  [key: string]: number | string;

  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  type: string;
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: any;
  total: number;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}
