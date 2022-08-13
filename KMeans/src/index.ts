import _ from "lodash";
import KMeans from "./KMeans";

// 1. data setting
const TESTSIZE = 50;
const testArray = _.map(new Array(TESTSIZE), () => [
  Math.floor(Math.random() * 100) + 1,
  Math.floor(Math.random() * 100) + 1,
]);

// 2. kmeans init
const kmeans = new KMeans(testArray);

// 3. init centroids
kmeans.setCentroids(1);
console.log(kmeans.centroids);

// 4. iteration pattern next
