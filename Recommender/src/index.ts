import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";
import _ from "lodash";
import MinMaxScaler from "@minmax-scaler";
import KMeans from "@kmeans";

const mailBoxId = "62f9a6221b1ae3a082abce38";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  builder.step1();

  await builder.step2(mailBoxId);
  await builder.step3();
  await builder.step4();

  const scaler = new MinMaxScaler(recommender.processDatas as number[][]);
  const datas = scaler.fit().transfrom();

  const kmeans = new KMeans(datas);
  kmeans.setCentroids(2);

  do {
    kmeans.next();
  } while (!kmeans.done);
  console.log(kmeans.labels);

  recommender.close();
})();
