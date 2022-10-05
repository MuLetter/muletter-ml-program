import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";
import { SeedZoneObserver } from "./SeedzoneObserver";
import _ from "lodash";
import MinMaxScaler from "@minmaxscaler";
import KMeans from "@kmeans";

const mailBoxId = "633abccf965295f042519aa4";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  await SeedZoneObserver.open();

  const sObs = await SeedZoneObserver.init();

  sObs.run();
  await sObs.save();

  // const datas = scaler.fit().transfrom();
  // const kmeans = new KMeans(datas);
  // kmeans.setCentroids(2);

  // let labels!: number[];
  // for (labels of kmeans);

  // console.log(_.zip(sObs.processIds, labels));

  // // ClusterZone Example (아래의 값들이 저장되어야 함)
  // const K = kmeans.K;
  // const [min, max, minMaxSubtract] = [
  //   scaler.min,
  //   scaler.max,
  //   scaler.minMaxSubtract,
  // ];
  // const centroids = kmeans.centroids!;

  // const clusterZoneScaler = new MinMaxScaler([]);
  // clusterZoneScaler.min = min;
  // clusterZoneScaler.max = max;
  // clusterZoneScaler.minMaxSubtract = minMaxSubtract;

  // const clusterZoneKMeans = new KMeans([]);
  // clusterZoneKMeans.K = K;
  // clusterZoneKMeans.centroids = centroids;

  // const testDatas = clusterZoneScaler.transfrom(
  //   sObs.processDatas as number[][]
  // );
  // console.log(labels);
  // console.log(clusterZoneKMeans.transform(testDatas));

  // console.log(kmeans.centroids);
  // console.log(kmeans.transform(datas));
  // step 3, 4에서 SeedZoneObserver 동작
  // try {
  // await builder.step1();
  // await builder.step2(mailBoxId);
  //   console.log(recommender.spotifyToken);
  //   await builder.step3();
  //   await builder.step4();
  // } catch (err) {
  //   console.error(err);
  // }
  // for (let reco of recommender);
  // console.log(recommender.recoTracks.length);
  // console.log(recommender.recoTracks);
  // await recommender.isUseUpdate();
  // const mail = await recommender.saveDB();
  // console.log(mail);
  // await recommender.okay();
  // recommender.close();

  await SeedZoneObserver.close();
})();
