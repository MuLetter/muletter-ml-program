import _ from "lodash";
import MinMaxScaler from "./MinMaxScaler";

// 1. data setting
const TESTSIZE = 50;
const testArray = _.map(new Array(TESTSIZE), () => [
  Math.floor(Math.random() * 100) + 1,
  Math.floor(Math.random() * 100) + 1,
]);
console.log(testArray);

const scaler = new MinMaxScaler(testArray);
scaler.fit();

console.log(scaler.transfrom(testArray));
