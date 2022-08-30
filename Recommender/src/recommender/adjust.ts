import Recommender from "@recommender";
import { IRecommederAdjust } from "./types";

// Decorater
function RecommenderAdjust<T extends { new (...args: any[]): Recommender }>(
  constructor: T
): new (...args: any[]) => IRecommederAdjust {
  return class extends constructor {
    constructor(...args: any[]) {
      super();
    }
    [Symbol.iterator]() {
      return this;
    }
    next() {
      // this.run();
      if (
        this.recoTracks.length <= this.MAX_LENGTH &&
        this.recoTracks.length >= this.MIN_LENGTH
      )
        return { value: this.recoTracks.length, done: true };
      else return { value: this.recoTracks.length, done: false };
    }
  };
}

export default RecommenderAdjust;
