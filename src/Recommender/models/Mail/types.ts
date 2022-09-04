import { Schema } from "mongoose";
import { MailModel } from ".";
import { Track } from "../types";

export interface IMail {
  _id?: Schema.Types.ObjectId | string;
  title: string;
  tracks: Track[];
  createdAt?: Date;
  updatedAt?: Date;

  mailBoxId?: Schema.Types.ObjectId | string;
}

export class Mail implements IMail {
  _id?: Schema.Types.ObjectId | string;
  title: string;
  tracks: Track[];
  createdAt?: Date;
  updatedAt?: Date;

  mailBoxId?: Schema.Types.ObjectId | string;

  constructor(
    title: string,
    tracks: Track[],
    mailBoxId?: Schema.Types.ObjectId | string
  ) {
    this.title = title;
    this.tracks = tracks;
    this.mailBoxId = mailBoxId;
  }

  static getFromDocs(mail: IMail) {
    return new Mail(mail.title, mail.tracks, mail.mailBoxId);
  }

  async save() {
    const mail = await MailModel.create(this);

    return Mail.getFromDocs(mail);
  }
}
