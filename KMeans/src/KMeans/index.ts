import _ from "lodash";
import { clusterSeparation } from "./calculator";
import { v1, v2 } from "./setCentroids";
import { euclideanDistance, getMinLabel } from "./utils";

class KMeans {
  datas: number[][];
  colors: string[];
  K: number;

  // run datas
  labels?: number[];
  centroids?: number[][];
  done?: boolean;
  algType?: string;
  earlyStop: number;

  constructor(datas: number[][], earlyStop = 3) {
    this.datas = datas;
    this.K = Math.round(Math.sqrt(datas.length / 2));
    this.earlyStop = earlyStop;

    const colors: string[] = [];
    for (let i = 0; i < this.K; i++) {
      let color = Math.floor(Math.random() * 16777215).toString(16);
      while (color in colors) {
        color = Math.floor(Math.random() * 16777215).toString(16);
        console.log(color in colors);
      }
      colors.push(color);
    }
    this.colors = colors;
  }

  setCentroids(version: number) {
    // version 1. KMeans
    // version 2. KMeans++
    const minVersion = 1;
    const maxVersion = 2;
    switch (version) {
      case 1:
        this.algType = "KMeans";
        v1.call(this);
        break;
      case 2:
        this.algType = "KMeans++";
        v2.call(this);
        break;
      default:
        throw new Error(
          `Version.${version} not suported. Min Version.${minVersion}, Max Version.${maxVersion}`
        );
    }
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

  get clusterSeparation() {
    return clusterSeparation.call(this);
  }
}

export default KMeans;
