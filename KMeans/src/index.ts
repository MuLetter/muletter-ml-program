import _ from "lodash";
import KMeans from "./KMeans";

// 1. data setting
const TESTSIZE = 100;
const testArray = _.map(new Array(TESTSIZE), () => [
  Math.floor(Math.random() * 100) + 1,
  Math.floor(Math.random() * 100) + 1,
]);

// 2. kmeans init
const kmeans = new KMeans(testArray);

// 3. init centroids
kmeans.setCentroids(1);
console.log(kmeans.centroids);

// 4. iteration pattern next
// 1 round
do {
  kmeans.next();
  // console.log(kmeans.labels);
} while (!kmeans.done);

// DOM Test
const colors: string[] = [];
const elSVG = document.getElementById("scatter");
for (let label of _.uniq(kmeans.labels)) {
  let color = Math.floor(Math.random() * 16777215).toString(16);
  while (color in colors) {
    color = Math.floor(Math.random() * 16777215).toString(16);
    console.log(color in colors);
  }
  colors.push(color);

  const members = _.filter(kmeans.datas, (d, i) => kmeans.labels![i] === label);

  members.forEach((member) => {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", member[0].toString());
    circle.setAttribute("cy", member[1].toString());
    circle.setAttribute("r", "2");
    circle.setAttribute("fill", "#" + color);

    elSVG?.appendChild(circle);
  });
}
