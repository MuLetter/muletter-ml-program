import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";
import _ from "lodash";
import { partition } from "@recommender/utils";

const mailBoxId = "62f9a6221b1ae3a082abce38";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  builder.step1();

  await builder.step2(mailBoxId);
  await builder.step3();
  await builder.step4();

  recommender.close();
})();
