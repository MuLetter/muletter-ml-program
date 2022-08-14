import _ from "lodash";
import KMeans from "./KMeans";

let kmeans: KMeans;

function init() {
  // 1. data setting
  const TESTSIZE = 100;
  const testArray = _.map(new Array(TESTSIZE), () => [
    Math.floor(Math.random() * 100) + 1,
    Math.floor(Math.random() * 100) + 1,
  ]);

  // 2. kmeans init
  kmeans = new KMeans(testArray);

  // 3. init centroids
  kmeans.setCentroids(1);
  console.log(kmeans.centroids);
}

init();

// 4. iteration pattern next
// 1 round
do {
  kmeans!.next();
  // console.log(kmeans.labels);
} while (!kmeans!.done);

// DOM Test
function render() {
  const elSVG = document.getElementById("scatter");
  const circles = document.querySelectorAll("circle");
  circles.forEach((circle) => {
    circle.remove();
  });

  for (let label of _.uniq(kmeans!.labels)) {
    const members = _.filter(
      kmeans!.datas,
      (d, i) => kmeans.labels![i] === label
    );

    members.forEach((member) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", member[0].toString());
      circle.setAttribute("cy", member[1].toString());
      circle.setAttribute("r", "2");
      circle.setAttribute("fill", "#" + kmeans.colors[label]);

      elSVG?.appendChild(circle);
    });
  }
}

render();

const elInit = document.querySelector<HTMLButtonElement>(".init");
elInit?.addEventListener("click", () => {
  init();
  render();
});

const elNext = document.querySelector<HTMLButtonElement>(".next");
elNext?.addEventListener("click", () => {
  if (kmeans.done) alert("이미 종료된 kmeans 입니다.");
  else {
    kmeans.next();
    render();
  }
});
