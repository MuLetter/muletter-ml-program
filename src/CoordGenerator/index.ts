import { ClusterZone } from "../SeedzoneObserver/types";
import _ from "lodash";
import { MailBoxModel } from "@recommender/models";
import { SeedZoneModel } from "../SeedzoneObserver/model";

export class CoordGenerator {
  static async getCoord(mailBoxId: string) {
    const mailBox = await MailBoxModel.findById(mailBoxId);
    const clusterZone = await ClusterZone.recovery();

    const K = clusterZone.kmeans.K;
    const counts = _.fill(Array(K), 0);

    const trackIds = _.map(mailBox!.tracks, ({ id }) => id);
    console.log(trackIds);
    const seedCheck = await SeedZoneModel.find(
      {
        id: { $in: trackIds },
      },
      {
        _id: 0,
        id: 1,
        label: 1,
      }
    );
    console.log(seedCheck);
    const labelCounts = _.countBy(seedCheck, ({ label }) => label);
    console.log(labelCounts);

    _.forIn(labelCounts, (v, k) => {
      counts[parseInt(k)] = v;
    });
    console.log(counts);
    const totalCount = _.sum(counts);
    const countPercentages = _.map(
      counts,
      (count) => (count / totalCount) * 100
    );
    console.log(countPercentages);
  }
}
