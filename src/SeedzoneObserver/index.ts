import { dbConnect, dbDisconnect } from "@recommender/models/connect";
import { SeedZoneModel } from "./model";
import { ClusterZone, ISeedZone, SeedZone } from "./types";
import _ from "lodash";
import MinMaxScaler from "@minmaxscaler";
import KMeans from "@kmeans";

export class SeedZoneObserver {
  datas: ISeedZone[];
  scaler?: MinMaxScaler;
  kmeans?: KMeans;

  constructor(datas: ISeedZone[]) {
    this.datas = datas;
  }

  // db connect
  static async open() {
    await dbConnect();
  }

  // db close
  static async close() {
    await dbDisconnect();
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

  run() {
    const scaler = new MinMaxScaler(this.processDatas as number[][]);
    const datas = scaler.fit().transfrom();

    const kmeans = new KMeans(datas);
    kmeans.setCentroids(2);

    let labels!: number[];
    for (labels of kmeans);

    this.scaler = scaler;
    this.kmeans = kmeans;
  }

  async save() {
    const zipDatas = _.zip(this.processIds, this.kmeans!.labels!);

    for (let [id, label] of zipDatas)
      await SeedZoneModel.updateOne(
        { id },
        {
          $set: {
            label: label,
          },
        }
      );

    await ClusterZone.save(this.kmeans!, this.scaler!);
  }
}
