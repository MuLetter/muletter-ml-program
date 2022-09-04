"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v2 = exports.v1 = void 0;
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("./utils");
function v1() {
    const idxes = lodash_1.default.range(0, this.datas.length);
    const centroidIdxes = lodash_1.default.sampleSize(idxes, this.K);
    this.centroids = lodash_1.default.filter(this.datas, (v, i) => lodash_1.default.indexOf(centroidIdxes, i) !== -1);
}
exports.v1 = v1;
function v2() {
    const idxes = lodash_1.default.range(0, this.datas.length);
    // first is random
    const ranIdx = lodash_1.default.sample(idxes);
    const centroids = [this.datas[ranIdx]];
    // next set with distance propotinal
    while (centroids.length < this.K) {
        const disPropotinal = (0, utils_1.getDistancePropotinal)(this.datas, centroids);
        const nextIdx = (0, utils_1.getMaxLabel)(disPropotinal);
        centroids.push(this.datas[nextIdx]);
    }
    this.centroids = centroids;
}
exports.v2 = v2;
