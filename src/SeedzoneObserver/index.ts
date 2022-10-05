import { ISeedZone, SeedZone } from "./types";

export class SeedZoneObserver {
  constructor() {}

  static async append(datas: ISeedZone[]) {
    await SeedZone.append(datas);
  }
}
