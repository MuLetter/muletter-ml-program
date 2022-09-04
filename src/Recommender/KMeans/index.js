"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const calculator_1 = require("./calculator");
const setCentroids_1 = require("./setCentroids");
const utils_1 = require("./utils");
class KMeans {
    constructor(datas, earlyStop = 3) {
        this.datas = datas;
        this.K = Math.round(Math.sqrt(datas.length / 2));
        this.earlyStop = earlyStop;
    }
    setCentroids(version) {
        // version 1. KMeans
        // version 2. KMeans++
        const minVersion = 1;
        const maxVersion = 2;
        switch (version) {
            case 1:
                this.algType = "kmeans";
                setCentroids_1.v1.call(this);
                break;
            case 2:
                this.algType = "kmeans-plus";
                setCentroids_1.v2.call(this);
                break;
            default:
                throw new Error(`Version.${version} not suported. Min Version.${minVersion}, Max Version.${maxVersion}`);
        }
        this.done = false;
        this.labels = lodash_1.default.fill(new Array(this.datas.length), 0);
    }
    next() {
        this.labels = lodash_1.default.map(this.datas, (x) => (0, utils_1.getMinLabel)(lodash_1.default.map(this.centroids, (centroid) => (0, utils_1.euclideanDistance)(x, centroid))));
        const newCentroids = new Array(this.K);
        for (let label of lodash_1.default.uniq(this.labels)) {
            const members = lodash_1.default.filter(this.datas, (d, i) => this.labels[i] === label);
            const zipDatas = lodash_1.default.zip.apply(null, members);
            newCentroids[label] = lodash_1.default.map(zipDatas, (z) => lodash_1.default.mean(z));
        }
        if (lodash_1.default.isEqual(this.centroids, newCentroids))
            this.earlyStop--;
        this.centroids = newCentroids;
        if (this.earlyStop === 0)
            this.done = true;
    }
    get clusterSeparation() {
        return calculator_1.clusterSeparation.call(this);
    }
    get tss() {
        return (0, calculator_1.sumOfSqaured)(this.datas);
    }
    get wss() {
        let wss = 0;
        for (let label of lodash_1.default.uniq(this.labels)) {
            const filtered = lodash_1.default.filter(this.datas, (data, idx) => this.labels[idx] === label);
            const sse = (0, calculator_1.sumOfSqaured)(filtered);
            wss += sse;
        }
        return wss;
    }
    get ecv() {
        return (1 - this.wss / this.tss) * 100;
    }
}
exports.default = KMeans;
