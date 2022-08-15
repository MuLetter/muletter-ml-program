import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";
import { getToken } from "@api";

const mailBoxId = "62f9a6221b1ae3a082abce38";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  builder.step1();

  try {
    const token = await getToken();
    console.log("token", token.data);
  } catch (err) {}

  await builder.step2(mailBoxId);

  const tracks = recommender.mailBox;
  console.log();

  recommender.close();
})();
