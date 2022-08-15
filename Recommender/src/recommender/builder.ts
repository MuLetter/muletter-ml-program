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

  // 3. ArtistAndGenres
  async step3() {
    await this.recommender.addArtistAndGenres();
  }

  get() {
    return this.recommender;
  }
}

export default RecommenderBuilder;
