import { dbConnect, dbDisconnect } from "@models/connect";
import { MailBoxModel } from "@models/MailBox";
import { MailBox } from "@models/types";
import dotenv from "dotenv";

class Recommender {
  mailBox?: MailBox;

  constructor() {
    dotenv.config();
  }

  // db connect
  async open() {
    await dbConnect();
  }

  // db close
  async close() {
    await dbDisconnect();
  }

  // add mailbox
  async addMailBox(id: string) {
    try {
      const mailBox = await MailBoxModel.findById(id);

      if (mailBox) this.mailBox = mailBox;
    } catch (err) {}
  }
}

export default Recommender;
