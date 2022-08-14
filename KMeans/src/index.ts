import _ from "lodash";
import KMeans from "./KMeans";
import MinMaxScaler from "./MinMaxScaler";

// 1. data setting
const TESTSIZE = 50;
const testArray = _.map(new Array(TESTSIZE), () => [
  Math.floor(Math.random() * 100) + 1,
  Math.floor(Math.random() * 100) + 1,
]);

// 2. min - max scaling
const datas = new MinMaxScaler(testArray).fit().transfrom();
const kmeans = new KMeans(datas);

kmeans.setCentroids(2);
do {
  console.log(kmeans.ecv);
  kmeans.next();
} while (!kmeans.done);

console.log(kmeans.labels);
