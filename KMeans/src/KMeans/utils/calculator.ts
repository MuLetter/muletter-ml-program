import _ from "lodash";

export function euclideanDistance(x: number[], y: number[]) {
  const zipDatas = _.zip(x, y);
  return Math.sqrt(
    _.sum(
      _.map(zipDatas, (z: [number, number]) => _.subtract.apply(null, z) ** 2)
    )
  );
}
