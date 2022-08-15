import { getFeatures } from "@api";
import { AudioFeature, HasToken } from "@api/types";
import { Track } from "@models/types";
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

export class FeaturesGenerator {
  datas: Track[];

  constructor(datas: Track[]) {
    this.datas = datas;
  }

  async generate(hasToken: HasToken) {
    let features: ProcessAudioFeatures[] = [];

    const trackIds = _.uniq(_.map(this.datas, (track) => track.trackId));
    const partitioned = partition(trackIds, 100);

    let groupNum = 0;
    while (true) {
      const filtered = _.filter(
        partitioned,
        (part) => part.groupNum === groupNum
      );
      if (filtered.length === 0) break;
      const ids = _.map(filtered, (filter) => filter.data).join(",");

      const res = await getFeatures.call(hasToken, ids);
      const audioFeatures = res.data.audio_features;

      // 필요로 하는 것만 parsing
      const processAudioFeatures = _.map(audioFeatures, parseNeedFeatures);
      features = _.concat(features, processAudioFeatures);

      groupNum++;
    }

    return features;
  }
}
