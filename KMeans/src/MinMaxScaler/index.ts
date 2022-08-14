import _ from "lodash";
import { arrayDivide, arraySubtract } from "./calculator";

class MinMaxScaler {
  datas: number[][];

  min?: (number | undefined)[];
  max?: (number | undefined)[];
  minMaxSubtract?: (number | undefined)[];

  constructor(datas: number[][]) {
    this.datas = datas;
  }

  fit() {
    const zipDatas = _.unzip(this.datas);

    this.min = _.map(zipDatas, (zipData) => _.min(zipData));
    this.max = _.map(zipDatas, (zipData) => _.max(zipData));
    this.minMaxSubtract = arraySubtract(this.max, this.min);
  }

  transfrom(datas: number[][]) {
    if (!this.minMaxSubtract) throw new Error("Pleash fit execute.");
    return _.map(datas, (X) =>
      arrayDivide(arraySubtract(X, this.min!), this.minMaxSubtract!)
    );
  }
}

export default MinMaxScaler;
