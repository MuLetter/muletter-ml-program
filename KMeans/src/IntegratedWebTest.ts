import KMeans from "./KMeans";
import MinMaxScaler from "./MinMaxScaler";
import _ from "lodash";
import { generateRandomColor } from "./KMeans/utils/styles";

const TESTSIZE = 5000;
let kmeans: KMeans, kmeansplus: KMeans;
let testDatas: number[][];
let scaler: MinMaxScaler;

function setEvent() {
  document.querySelectorAll(".init").forEach((initBtn) => {
    // const cont = initBtn.closest(".container");
    initBtn.addEventListener("click", () => {
      init();
      render();
    });
  });

  document.querySelectorAll(".next").forEach((nextBtn) => {
    const cont = nextBtn.closest(".container");

    let _kmeans: KMeans;
    if (cont!.classList.contains("kmeans")) _kmeans = kmeans;
    else if (cont!.classList.contains("kmeans-plus")) _kmeans = kmeansplus;

    nextBtn.addEventListener("click", () => {
      if (_kmeans!.done) {
        alert("마무리 된 작업입니다.");
        return;
      }
      _kmeans!.next();
      render();
    });
  });
}

function init() {
  testDatas = _.map(new Array(TESTSIZE), () => [
    Math.floor(Math.random() * 100) + 1,
    Math.floor(Math.random() * 100) + 1,
  ]);
  scaler = new MinMaxScaler(testDatas);
  const datas = scaler.fit().transfrom();

  kmeans = new KMeans(datas);
  kmeans.setCentroids(1);

  kmeansplus = new KMeans(datas);
  kmeansplus.setCentroids(2);

  const colors = generateRandomColor(kmeans.K);
  kmeans.colors = colors;
  kmeansplus.colors = colors;

  setEvent();
}

function render() {
  const circles = document.querySelectorAll("circle");
  circles.forEach((circle) => {
    circle.remove();
  });

  const elScatters = document.querySelectorAll(".scatter");
  for (let elScatter of elScatters) {
    let _kmeans: KMeans;
    if (elScatter.classList.contains("kmeans")) {
      _kmeans = kmeans;
    } else if (elScatter.classList.contains("kmeans-plus")) {
      _kmeans = kmeansplus;
    }

    for (let label of _.uniq(_kmeans!.labels)) {
      const members = _.filter(
        testDatas,
        (d, i) => _kmeans.labels![i] === label
      );

      members.forEach((member) => {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", member[0].toString());
        circle.setAttribute("cy", member[1].toString());
        circle.setAttribute("r", "2");
        circle.setAttribute("fill", "#" + _kmeans.colors![label]);

        elScatter.appendChild(circle);
      });

      const _centroids = scaler.reverseTransform(_kmeans!.centroids!);
      _centroids.forEach((centroid, label) => {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", centroid[0].toString());
        circle.setAttribute("cy", centroid[1].toString());
        circle.setAttribute("r", "2");
        circle.setAttribute("fill", "#" + _kmeans.colors![label]);

        elScatter.appendChild(circle);
      });
    }

    const ecvParagraph = document.querySelector(`div.${_kmeans!.algType} > p`);
    if (ecvParagraph) ecvParagraph.textContent = _kmeans!.ecv.toString();
  }
}

init();
render();
