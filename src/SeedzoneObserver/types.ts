import KMeans from "@kmeans";
import MinMaxScaler from "@minmaxscaler";
import { Schema } from "mongoose";
import { ClusterZoneModel, SeedZoneModel } from "./model";

export interface ISeedZone {
  [key: string]: string | number | undefined;

  _id?: string;
  id: string;
  danceability: number;
  energy: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  liveness: number;
  valence: number;
  tempo: number;

  label?: number;
}

export class SeedZone implements ISeedZone {
  [key: string]: string | number | undefined;

  _id?: string;
  id: string;
  danceability: number;
  energy: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  liveness: number;
  valence: number;
  tempo: number;

  label?: number;

  constructor(seedzone: ISeedZone) {
    this.id = seedzone.id;
    this.danceability = seedzone.danceability;
    this.energy = seedzone.energy;
    this.loudness = seedzone.loudness;
    this.speechiness = seedzone.speechiness;
    this.acousticness = seedzone.acousticness;
    this.liveness = seedzone.liveness;
    this.valence = seedzone.valence;
    this.tempo = seedzone.tempo;
  }

  static async append(datas: ISeedZone[]) {
    for (let data of datas) {
      const isExists = await SeedZoneModel.exists({ id: data.id });
      if (!isExists) SeedZoneModel.create(data);
    }
  }

  static async observing() {
    return await SeedZoneModel.estimatedDocumentCount();
  }
}

export interface IScalerMemory {
  min: number[];
  max: number[];
  minMaxSubtract: number[];
}

export interface IClusterZone {
  _id?: Schema.Types.ObjectId | string;
  K: number;
  scaler: IScalerMemory;
  centroids: number[][];

  createdAt?: Date;
  updatedAt?: Date;
}

export class ClusterZone {
  scaler: MinMaxScaler;
  kmeans: KMeans;

  constructor(clusterZone: IClusterZone) {
    this.scaler = new MinMaxScaler([]);
    const { min, max, minMaxSubtract } = clusterZone.scaler;
    this.scaler.min = min;
    this.scaler.max = max;
    this.scaler.minMaxSubtract = minMaxSubtract;

    this.kmeans = new KMeans([]);
    const { K, centroids } = clusterZone;
    this.kmeans.K = K;
    this.kmeans.centroids = centroids;
  }

  transform(datas: number[][]) {
    const norms = this.scaler.transfrom(datas);

    return this.kmeans.transform(norms);
  }

  static async recovery() {
    const docs = await ClusterZoneModel.find(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    const doc = docs[0];

    return new ClusterZone(doc);
  }

  static async save(kmeans: KMeans, scaler: MinMaxScaler) {
    const K = kmeans.K!;
    const [min, max, minMaxSubtract] = [
      scaler.min,
      scaler.max,
      scaler.minMaxSubtract,
    ];
    const centroids = kmeans.centroids!;

    await ClusterZoneModel.create({
      K,
      scaler: {
        min,
        max,
        minMaxSubtract,
      },
      centroids,
    });
  }
}
