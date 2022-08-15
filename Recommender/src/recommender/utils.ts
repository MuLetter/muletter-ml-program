import _ from "lodash";
import { PartitionData } from "./types";

export function partition(data: any[], size: number): PartitionData[] {
  return _.map(data, (d, idx) => ({
    data: d,
    groupNum: Math.floor(idx / size),
  }));
}
