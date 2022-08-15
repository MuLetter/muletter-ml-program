import { model, Schema } from "mongoose";
import { MailBox } from "./types";

const MailBoxSchema = new Schema<MailBox>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: { type: String, required: false },
    tracks: [{ type: Schema.Types.Mixed, required: false }],
  },
  {
    collection: "MailBox",
    timestamps: true,
  }
);

export const MailBoxModel = model<MailBox>("MailBox", MailBoxSchema);
