import Recommender from "@recommender";

class RecommenderBuilder {
  recommender: Recommender;

  constructor() {
    this.recommender = new Recommender();
  }

  // 1. 추천자 객체 db connect
  async step1() {
    await this.recommender.open();
  }

  // 2. mail box init
  async step2(id: string) {
    await this.recommender.addMailBox(id);
    await this.recommender.addAvailableGenres();
  }

  // 3. ArtistAndGenres and AudioFeatures, for User
  async step3() {
    await this.recommender.addArtistAndGenres();
    await this.recommender.addAudioFeatures();
  }

  // 4. set seed and recommend API Call
  async step4() {
    this.recommender.addSeeds();
    await this.recommender.addRecommendations();
    await this.recommender.addRecoAudioFeatures();
  }

  get(): Iterable<Recommender> & Recommender {
    return this.recommender as Iterable<Recommender> & Recommender;
  }
}

export default RecommenderBuilder;
