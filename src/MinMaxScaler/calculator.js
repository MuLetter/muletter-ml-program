"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayMultiply = exports.arrayDivide = exports.arraySubtract = exports.arraySum = void 0;
const lodash_1 = __importDefault(require("lodash"));
function arraySum(X, Y) {
    return lodash_1.default.map(X, (x, XIdx) => x + Y[XIdx]);
}
exports.arraySum = arraySum;
function arraySubtract(X, Y) {
    return lodash_1.default.map(X, (x, XIdx) => lodash_1.default.subtract(x, Y[XIdx]));
}
exports.arraySubtract = arraySubtract;
function arrayDivide(X, Y) {
    return lodash_1.default.map(X, (x, XIdx) => lodash_1.default.divide(x, Y[XIdx]));
}
exports.arrayDivide = arrayDivide;
function arrayMultiply(X, Y) {
    return lodash_1.default.map(X, (x, XIdx) => lodash_1.default.multiply(x, Y[XIdx]));
}
exports.arrayMultiply = arrayMultiply;
