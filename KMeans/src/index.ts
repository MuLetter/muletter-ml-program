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
kmeans.setCentroids(1);
let v1Separation = 0;
console.log(kmeans.clusterSeparation, kmeans.centroids);

kmeans.setCentroids(2);
console.log(kmeans.clusterSeparation, kmeans.centroids);
