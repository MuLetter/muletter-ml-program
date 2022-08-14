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

// 3. kmeans++ set centroids
// kmeans.setCentroids(1);
// console.log(kmeans.clusterSeparation, kmeans.centroids);
kmeans.setCentroids(2);
console.log(kmeans.clusterSeparation, kmeans.centroids);
// kmeans.next();
// // 4. tss
// console.log(kmeans.tss);

// // 5. wss
// console.log(kmeans.wss);

// // 6. ecv
// console.log(kmeans.ecv);
do {
  console.log(kmeans.ecv);
  kmeans.next();
} while (!kmeans.done);
