import Recommender from "@recommender";
import { IRecommederAdjust } from "./types";

// Decorater
function RecommenderAdjust<T extends { new (...args: any[]): Recommender }>(
  constructor: T
): new (...args: any[]) => IRecommederAdjust {
  return class extends constructor {
    constructor(...args: any[]) {
      super();

      console.log("adjusting");
    }
    check() {
      console.log("adjust testing");
    }
  };
}

export default RecommenderAdjust;
