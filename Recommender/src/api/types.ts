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
