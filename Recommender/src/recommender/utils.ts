import { AudioFeature } from "@api/types";
import _ from "lodash";
import { NEED_FEATURES } from "./common";
import { PartitionData, ProcessAudioFeatures } from "./types";

export function partition(data: any[], size: number): PartitionData[] {
  return _.map(data, (d, idx) => ({
    data: d,
    groupNum: Math.floor(idx / size),
  }));
}

export function parseNeedFeatures(feature: AudioFeature) {
  const processAudioFeaturs: ProcessAudioFeatures = {} as any;
  for (let parse of NEED_FEATURES) {
    (processAudioFeaturs as any)[parse] = feature[parse];
  }

  return processAudioFeaturs;
}
