import { dbConnect, dbDisconnect } from "@recommender/models/connect";
import { SeedZoneModel } from "./model";
import { ClusterZone, ISeedZone, SeedZone } from "./types";
import _ from "lodash";
import MinMaxScaler from "@minmaxscaler";
import KMeans from "@kmeans";
import { euclideanDistance, getMinLabel } from "@kmeans/utils";
import { symlinkSync } from "fs";

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
    const datas = await SeedZoneModel.find({}, { _id: 0, __v: 0, label: 0 });

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

  sorting() {
    const labels = _.range(0, this.kmeans!.K);
    const centroids = this.kmeans!.centroids;

    const centroidsEucs = _.map(centroids, (x) =>
      _.map(centroids, (y) => euclideanDistance(x, y))
    );
    const means = _.map(centroidsEucs, _.mean);

    // 기준점
    const minIdx = getMinLabel(means);
    const newLabels = _.fill(Array(labels.length), -1);
    console.log(_.every(newLabels, -1));
    newLabels[0] = minIdx;

    // 검사의 대상
    let target = centroidsEucs[minIdx];
    target[minIdx] = Number.MAX_SAFE_INTEGER;

    // 양쪽 배치
    let rightIdx = 1;
    let rightMinIdx = getMinLabel(target);
    target[rightMinIdx] = Number.MAX_SAFE_INTEGER;
    newLabels[rightIdx] = rightMinIdx;

    let leftIdx = labels.length - 1;
    let leftMinIdx = getMinLabel(target);
    newLabels[leftIdx] = leftMinIdx;

    // 나머지 start
    while (true) {
      const okNewLabels = _.filter(newLabels, (label) => label !== -1);
      console.log(rightIdx, leftIdx, newLabels);

      if (okNewLabels.length === labels.length) break;

      const rightTarget = centroidsEucs[rightMinIdx];
      const leftTarget = centroidsEucs[leftMinIdx];

      _.forEach(okNewLabels, (ok) => {
        rightTarget[ok] = Number.MAX_SAFE_INTEGER;
        leftTarget[ok] = Number.MAX_SAFE_INTEGER;
      });
      rightMinIdx = getMinLabel(rightTarget);
      leftMinIdx = getMinLabel(leftTarget);
      if (rightMinIdx === leftMinIdx) {
        const eqMinIdx = rightMinIdx;
        if (rightTarget[eqMinIdx] >= leftTarget[eqMinIdx]) {
          newLabels[--leftIdx] = eqMinIdx;
        } else {
          newLabels[++rightIdx] = eqMinIdx;
        }
      } else {
        newLabels[++rightIdx] = rightMinIdx;
        newLabels[--leftIdx] = leftMinIdx;
      }
    }
    const kmeansInjectedLabels = _.map(this.kmeans!.labels, (label) =>
      _.findIndex(newLabels, (n) => n === label)
    );
    const kmeansInjectedCentroids = _.map(
      newLabels,
      (label) => centroids![label]
    );

    this.kmeans!.labels = kmeansInjectedLabels;
    this.kmeans!.centroids = kmeansInjectedCentroids;
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
