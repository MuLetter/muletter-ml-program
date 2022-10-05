import { getToken } from "../../api";
import { Schema } from "mongoose";
import { MailBoxModel } from ".";
import { Track } from "../types";
import _ from "lodash";

export type IMailBox = {
  _id?: Schema.Types.ObjectId | string;

  title: string;
  description: string;
  imagePath?: string;
  tracks: Track[];

  createdAt?: Date;
  updatedAt?: Date;
};

export class MailBox implements IMailBox {
  _id?: Schema.Types.ObjectId | string;

  title: string;
  description: string;
  imagePath?: string;
  tracks: Track[];

  // mailCount : number

  createdAt?: Date;
  updatedAt?: Date;

  spotifyToken?: string;

  constructor(
    title: string,
    description: string,
    tracks: Track[],
    _id?: Schema.Types.ObjectId | string,
    imagePath?: string
  ) {
    this.title = title;
    this.description = description;
    this.tracks = tracks;
    this._id = _id;
    this.imagePath = imagePath;
  }

  async setSpotifyToken() {
    const resToken = await getToken();
    this.spotifyToken = resToken.data.access_token;
  }

  static getFromDocs(mailBox: IMailBox) {
    return new MailBox(
      mailBox.title,
      mailBox.description,
      mailBox.tracks,
      mailBox._id,
      mailBox.imagePath
    );
  }

  static async getById(
    id: Schema.Types.ObjectId | string,
    setSpotify?: boolean
  ) {
    const mailBoxDoc = await MailBoxModel.findById(id);
    if (!mailBoxDoc) {
      throw new Error("MailBox Not Found!");
    }
    const mailBox = MailBox.getFromDocs(mailBoxDoc);

    if (setSpotify) await mailBox.setSpotifyToken();

    return mailBox;
  }

  async isUseUpdate() {
    const originalMailBox = await MailBoxModel.findById(this._id);

    await MailBoxModel.updateOne(
      { _id: this._id },
      {
        $set: {
          tracks: _.map(originalMailBox!.tracks, (track) => ({
            ...track,
            isUse: true,
          })),
        },
      }
    );
  }
}
