import "module-alias/register";
import RecommenderBuilder from "@recommender/builder";

const mailBoxId = "633abccf965295f042519aa4";
const builder = new RecommenderBuilder();
const recommender = builder.get();

(async () => {
  // step 3, 4에서 SeedZoneObserver 동작
  // try {
  //   await builder.step1();
  //   await builder.step2(mailBoxId);
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
})();
