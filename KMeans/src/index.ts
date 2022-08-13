import _, { min } from "lodash";
import KMeans from "./KMeans";
import { euclideanDistance } from "./KMeans/utils";

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
console.log(kmeans.labels);

// 1 round
kmeans.next();
console.log(kmeans.centroids);

// 2 round
kmeans.next();
console.log(kmeans.centroids);
