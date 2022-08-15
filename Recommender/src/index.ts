import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";

const mailBoxId = "62f9a6221b1ae3a082abce38";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  builder.step1();

  await builder.step2(mailBoxId);
  console.log(recommender.mailBox);

  recommender.close();
})();
