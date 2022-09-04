import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";

const mailBoxId = "630cf87e3d8416941f682257";
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

  for (let reco of recommender) {
    console.log(reco);
  }
  console.log(recommender.recoTracks.length);
  console.log(recommender.recoTracks);

  const mail = await recommender.saveDB();
  console.log(mail);

  recommender.close();
})();
