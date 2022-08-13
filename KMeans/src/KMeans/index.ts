import _ from "lodash";
import { euclideanDistance, getMinLabel } from "./utils";

class KMeans {
  datas: number[][];
  K: number;

  // run datas
  labels?: number[];
  centroids?: number[][];
  done?: boolean;
  earlyStop: number;

  constructor(datas: number[][], earlyStop = 3) {
    this.datas = datas;
    this.K = Math.round(Math.sqrt(datas.length / 2));
    this.earlyStop = earlyStop;
  }

  setCentroids(version: number) {
    // version 1. KMeans
    // version 2. KMeans++
    const idxes = _.range(0, this.datas.length);
    const centroidIdxes = _.sampleSize(idxes, this.K);
    this.centroids = _.filter(
      this.datas,
      (v, i) => _.indexOf(centroidIdxes, i) !== -1
    );
    this.done = false;
    this.labels = _.fill(new Array(this.datas.length), 0);
  }

  next() {
    this.labels = _.map(this.datas, (x) =>
      getMinLabel(
        _.map(this.centroids, (centroid) => euclideanDistance(x, centroid))
      )
    );

    const newCentroids = new Array(this.K);
    for (let label of _.uniq(this.labels)) {
      const members = _.filter(this.datas, (d, i) => this.labels![i] === label);
      const zipDatas = _.zip.apply(null, members);

      newCentroids[label] = _.map(zipDatas, (z) => _.mean(z));
    }

    if (_.isEqual(this.centroids, newCentroids)) this.earlyStop--;
    this.centroids = newCentroids;

    if (this.earlyStop === 0) this.done = true;
  }
}

export default KMeans;
