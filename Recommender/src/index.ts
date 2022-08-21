import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";
import _ from "lodash";
import MinMaxScaler from "@minmax-scaler";
import KMeans from "@kmeans";
import { euclideanDistance } from "@kmeans/utils";
import { dropTrackByLabelCount } from "@recommender/utils";

const mailBoxId = "62f9a6221b1ae3a082abce38";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  await builder.step1();

  await builder.step2(mailBoxId);

  await builder.step3();

  await builder.step4();

  recommender.runKMeans();
  console.log(recommender.kmeans?.labels);

  // recommender.parsingKMeansLabel();
  // console.log(recommender.recoIdsAndLabels);

  // // saveRecoTracks

  const userIds = _.uniq(
    _.map(recommender.mailBox?.tracks, ({ trackId }) => trackId)
  );
  const trackIdAndLabels = _.zip(
    recommender.processIds,
    recommender.kmeans!.labels
  );
  let userIdsAndLabels = _.filter(trackIdAndLabels, ([id]) =>
    _.includes(userIds, id)
  );
  let userLabels = _.uniq(_.unzip(userIdsAndLabels)[1]);

  let recoIdsAndLabels = _.filter(
    trackIdAndLabels,
    ([id, label]) => !_.includes(userIds, id) && _.includes(userLabels, label)
  );
  let [recoIds, recoLabels] = _.unzip(recoIdsAndLabels);

  // recoTracks
  let recoTracks = _.filter(recommender.recommendations, ({ trackId }) =>
    recoIds.includes(trackId)
  );
  let recoIdsKeyLabels = _.zipObject(recoIds as string[], recoLabels);
  recoTracks = _.map(recoTracks, (recoTrack) => ({
    ...recoTrack,
    label: recoIdsKeyLabels[recoTrack.trackId] as number,
  }));

  // 지워야 할 경우
  // drop RecoItem
  console.log(
    dropTrackByLabelCount(
      recoTracks,
      recommender.recoAudioFeatures!,
      recoIdsAndLabels
    ).length
  );

  // console.log(recommender.recoAudioFeatures);
  // let recoIdsAndLabels = ?

  // const trackIdAndLabels = _.zip(recommender.processIds, kmeans.labels);
  // console.log(_.groupBy(trackIdAndLabels, ([id, label]) => label));

  // 방법 1
  // const trackIdAndLabel = _.map(recommender.processIds, (trackId, idx) => ({
  //   trackId,
  //   label: kmeans.labels![idx],
  // }));
  // const userTrackIds = _.map(
  //   recommender.mailBox?.tracks,
  //   (track) => track.trackId
  // );
  // const userLabels = _.uniq(
  //   _.map(
  //     _.filter(trackIdAndLabel, ({ trackId }) =>
  //       userTrackIds.includes(trackId as string)
  //     ),
  //     ({ label }) => label
  //   )
  // );
  // console.log(userLabels);
  // const parsedRecoIds = _.map(
  //   _.filter(
  //     trackIdAndLabel,
  //     ({ trackId, label }) =>
  //       userLabels.includes(label) && !userTrackIds.includes(trackId as string)
  //   ),
  //   ({ trackId }) => trackId
  // );
  // console.log(parsedRecoIds);

  // console.log(
  //   _.filter(recommender.recommendations, ({ trackId }) =>
  //     parsedRecoIds.includes(trackId)
  //   )
  // );

  recommender.close();
})();
