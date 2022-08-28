import Recommender from "@recommender";

// Decorater
function RecommenderAdjust<T extends { new (...args: any[]): Recommender }>(
  constructor: T
) {
  return class extends constructor {};
}

export default RecommenderAdjust;
