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
let separations = _.map(kmeans.centroids, (X, XIdx) => {
  const filtered = _.filter(kmeans.centroids, (Y, YIdx) => XIdx !== YIdx);
  return _.map(filtered, (Y) => euclideanDistance(X, Y));
});
console.log(_.mean(_.flatten(separations)));
console.log(kmeans.centroids);

kmeans.setCentroids(2);
separations = _.map(kmeans.centroids, (X, XIdx) => {
  const filtered = _.filter(kmeans.centroids, (Y, YIdx) => XIdx !== YIdx);
  return _.map(filtered, (Y) => euclideanDistance(X, Y));
});
console.log(_.mean(_.flatten(separations)));
console.log(kmeans.centroids);
