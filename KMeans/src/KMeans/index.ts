import _ from "lodash";

class KMeans {
  datas: number[][];
  K: number;

  // run datas
  labels?: number[];
  centroids?: number[][];
  done?: boolean;

  constructor(datas: number[][]) {
    this.datas = datas;
    this.K = Math.round(Math.sqrt(datas.length / 2));
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

  next() {}
}

export default KMeans;
