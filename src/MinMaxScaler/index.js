"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const calculator_1 = require("./calculator");
class MinMaxScaler {
    constructor(datas) {
        this.datas = datas;
    }
    fit() {
        const zipDatas = lodash_1.default.unzip(this.datas);
        this.min = lodash_1.default.map(zipDatas, (zipData) => lodash_1.default.min(zipData));
        this.max = lodash_1.default.map(zipDatas, (zipData) => lodash_1.default.max(zipData));
        this.minMaxSubtract = (0, calculator_1.arraySubtract)(this.max, this.min);
        return this;
    }
    transfrom(datas) {
        if (!this.minMaxSubtract)
            throw new Error("Pleash fit execute.");
        if (!datas)
            datas = this.datas;
        return lodash_1.default.map(datas, (X) => (0, calculator_1.arrayDivide)((0, calculator_1.arraySubtract)(X, this.min), this.minMaxSubtract));
    }
    reverseTransform(datas) {
        return lodash_1.default.map(datas, (X) => (0, calculator_1.arraySum)((0, calculator_1.arrayMultiply)(X, this.minMaxSubtract), this.min));
    }
}
exports.default = MinMaxScaler;
