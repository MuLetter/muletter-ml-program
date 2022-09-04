"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistancePropotinal = exports.getMaxLabel = exports.getMinLabel = exports.euclideanDistance = void 0;
const lodash_1 = __importDefault(require("lodash"));
function euclideanDistance(x, y) {
    const zipDatas = lodash_1.default.zip(x, y);
    return Math.sqrt(lodash_1.default.sum(lodash_1.default.map(zipDatas, (z) => lodash_1.default.subtract.apply(null, z) ** 2)));
}
exports.euclideanDistance = euclideanDistance;
function getMinLabel(numbers) {
    let label = 0;
    let minValue = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (minValue > numbers[i]) {
            label = i;
            minValue = numbers[i];
        }
    }
    return label;
}
exports.getMinLabel = getMinLabel;
function getMaxLabel(numbers) {
    let label = 0;
    let maxValue = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (maxValue < numbers[i]) {
            label = i;
            maxValue = numbers[i];
        }
    }
    return label;
}
exports.getMaxLabel = getMaxLabel;
function getDistancePropotinal(X, Y) {
    return lodash_1.default.map(X, (x) => lodash_1.default.min(lodash_1.default.map(Y, (y) => euclideanDistance(x, y))));
}
exports.getDistancePropotinal = getDistancePropotinal;
