import { connect, disconnect } from "mongoose";

export async function dbDisconnect() {
  try {
    await disconnect();
    console.log("[mongoose] disconnected :)");
  } catch (err) {
    console.error("[mongoose] disconnect Error :(");
    console.error(err);
  }
}

export async function dbConnect() {
  const { MONGO_HOST, MONGO_PORT, MONGO_APP } = process.env;
  const connectURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APP}`;

  try {
    await connect(connectURL);
    console.log("[mongoose] connected :)");
  } catch (err) {
    console.error("[mongoose] connect Error :(");
    console.error(err);
  }
}

export async function init() {
  await dbConnect();
}
