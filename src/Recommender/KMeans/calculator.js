"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumOfSqaured = exports.clusterSeparation = void 0;
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("./utils");
// 높을 수록 좋은 거
function clusterSeparation() {
    const separations = lodash_1.default.map(this.centroids, (X, XIdx) => {
        const filtered = lodash_1.default.filter(this.centroids, (Y, YIdx) => XIdx !== YIdx);
        return lodash_1.default.map(filtered, (Y) => (0, utils_1.euclideanDistance)(X, Y));
    });
    return lodash_1.default.mean(lodash_1.default.flatten(separations));
}
exports.clusterSeparation = clusterSeparation;
function sumOfSqaured(datas) {
    const dataMean = lodash_1.default.map(lodash_1.default.unzip(datas), (zipData) => lodash_1.default.mean(zipData));
    const dataMeanDistances = lodash_1.default.map(datas, (data) => (0, utils_1.euclideanDistance)(dataMean, data) ** 2);
    return lodash_1.default.sum(dataMeanDistances);
}
exports.sumOfSqaured = sumOfSqaured;
