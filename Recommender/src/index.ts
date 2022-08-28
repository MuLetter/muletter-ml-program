import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";
import _ from "lodash";
import MinMaxScaler from "@minmax-scaler";
import KMeans from "@kmeans";
import { euclideanDistance } from "@kmeans/utils";
import { dropTrackByLabelCount } from "@recommender/utils";

const mailBoxId = "63044282eb7f4e96553cdd43";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  try {
    await builder.step1();

    await builder.step2(mailBoxId);

    await builder.step3();

    await builder.step4();
  } catch (err) {
    console.error(err);
  }
  // console.log(recommender.recommendations!.length);
  // console.log(recommender.recoAudioFeatures!.length);

  // recommender.run2();
  // const recoTracks = recommender.recoTracks;
  // console.log(recoTracks.length);

  // console.log(recommender.recommendations!.length);
  // console.log(recommender.recoAudioFeatures!.length);

  // recommender.runKMeans();
  // console.log(recommender.kmeans?.labels);

  // recommender.parsingKMeansLabel();
  // console.log(recommender.recoIdsAndLabels);

  // // // saveRecoTracks
  // const userIds = _.uniq(
  //   _.map(recommender.mailBox?.tracks, ({ trackId }) => trackId)
  // );
  // const trackIdAndLabels = _.zip(
  //   recommender.processIds,
  //   recommender.kmeans!.labels
  // );
  // let userIdsAndLabels = _.filter(trackIdAndLabels, ([id]) =>
  //   _.includes(userIds, id)
  // );
  // let userLabels = _.uniq(_.unzip(userIdsAndLabels)[1]);

  // let recoIdsAndLabels = _.filter(
  //   trackIdAndLabels,
  //   ([id, label]) => !_.includes(userIds, id) && _.includes(userLabels, label)
  // );
  // let [recoIds, recoLabels] = _.unzip(recoIdsAndLabels);

  // // recoTracks
  // let recoTracks = _.filter(recommender.recommendations, ({ trackId }) =>
  //   recoIds.includes(trackId)
  // );
  // let recoIdsKeyLabels = _.zipObject(recoIds as string[], recoLabels);
  // recoTracks = _.map(recoTracks, (recoTrack) => ({
  //   ...recoTrack,
  //   label: recoIdsKeyLabels[recoTrack.trackId] as number,
  // }));
  // console.log(recoIdsKeyLabels);

  // 지워야 할 경우
  // drop RecoItem
  // console.log(recoTracks.length);
  // recoTracks = dropTrackByLabelCount(
  //   recoTracks,
  //   recommender.recoAudioFeatures!,
  //   recoIdsAndLabels
  // );
  // console.log(recoTracks.length);

  // console.log(recommender.recommendations!.length);
  // console.log(recommender.recoAudioFeatures!.length);

  // // filter, real saving
  // recoIds = _.map(recoTracks, ({ trackId }) => trackId) as string[];
  // const filteredRecommendations = _.filter(
  //   recommender.recommendations,
  //   ({ trackId }) => !recoIds.includes(trackId)
  // );
  // const filteredRecoAudioFeatures = _.filter(
  //   recommender.recoAudioFeatures,
  //   ({ id }) => !recoIds.includes(id)
  // );

  // console.log(filteredRecommendations.length);
  // console.log(filteredRecoAudioFeatures.length);

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
