import { Schema } from "mongoose";

export type MailBox = {
  _id?: Schema.Types.ObjectId;

  title: string;
  description: string;
  imagePath?: string;
  tracks: Track[];

  createdAt?: Date;
  updatedAt?: Date;
};

export type Track = {
  trackId: string;
  trackName: string;
  artistIds: string;
  artistNames: string;
  image: string;
};
