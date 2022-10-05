import { dbConnect, dbDisconnect } from "@recommender/models/connect";
import SeedZoneModel from "./model";
import { ISeedZone, SeedZone } from "./types";
import _ from "lodash";

export class SeedZoneObserver {
  datas: ISeedZone[];

  constructor(datas: ISeedZone[]) {
    this.datas = datas;
  }

  static async append(datas: ISeedZone[]) {
    await SeedZone.append(datas);
  }

  static async init() {
    const datas = await SeedZoneModel.find({}, { _id: 0, __v: 0 });

    return new SeedZoneObserver(_.map(datas, (data) => data.toObject()));
  }

  get processIds() {
    return _.map(this.datas, (data) => _.values(data)[0]);
  }

  get processDatas() {
    return _.map(this.datas, (data) => _.tail(_.values(data)));
  }

  // db connect
  static async open() {
    await dbConnect();
  }

  // db close
  static async close() {
    await dbDisconnect();
  }
}
