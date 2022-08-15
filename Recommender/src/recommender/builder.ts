import Recommender from "@recommender";

class RecommenderBuilder {
  recommder: Recommender;

  constructor() {
    this.recommder = new Recommender();
  }

  // 1. 추천자 객체 db connect
  async step1() {
    await this.recommder.open();
  }

  // 2. mail box init
  async step2(id: string) {
    await this.recommder.addMailBox(id);
  }

  get() {
    return this.recommder;
  }
}

export default RecommenderBuilder;
