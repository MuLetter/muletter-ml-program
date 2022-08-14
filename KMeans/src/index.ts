import _ from "lodash";
import KMeans from "./KMeans";
import {
  euclideanDistance,
  getDistancePropotinal,
  getMaxLabel,
  getMinLabel,
} from "./KMeans/utils";

// 1. data setting
const TESTSIZE = 50;
const testArray = _.map(new Array(TESTSIZE), () => [
  Math.floor(Math.random() * 100) + 1,
  Math.floor(Math.random() * 100) + 1,
]);

// 2. kmeans init
const kmeans = new KMeans(testArray);

// 3. kmeans++ set centroids
// kmeans.setCentroids(1);
// console.log(kmeans.clusterSeparation, kmeans.centroids);

kmeans.setCentroids(2);
console.log(kmeans.clusterSeparation, kmeans.centroids);

// 4. tss
const dataMean = _.map(_.unzip(kmeans.datas), (zipData) => _.mean(zipData));
const dataMeanDistances = _.map(
  kmeans.datas,
  (data) => euclideanDistance(dataMean, data) ** 2
);
const dataMeanDistance = _.sum(dataMeanDistances);
console.log(dataMeanDistance);

// 5. wss
