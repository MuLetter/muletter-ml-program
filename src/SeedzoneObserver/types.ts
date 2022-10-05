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

export interface IClusterZone {
  _id?: Schema.Types.ObjectId | string;
  K: number;
  scaler: {
    min: number[];
    max: number[];
    minMaxSubtract: number[];
  };
  centroids: number[][];

  createdAt?: Date;
  updatedAt?: Date;
}

export class ClusterZone {
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
