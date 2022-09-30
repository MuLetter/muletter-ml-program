import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";

const mailBoxId = "63366ea6071259d5a3385f87";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  try {
    await builder.step1();
    await builder.step2(mailBoxId);
    console.log(recommender.spotifyToken);
    await builder.step3();
    await builder.step4();
  } catch (err) {
    console.error(err);
  }

  for (let reco of recommender);
  console.log(recommender.recoTracks.length);
  console.log(recommender.recoTracks);

  // const mail = await recommender.saveDB();
  // console.log(mail);

  await recommender.okay();
})();
