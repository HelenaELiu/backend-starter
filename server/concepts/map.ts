import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface MapDoc extends BaseDoc {
  x: number;
  y: number;
}

export interface PinDoc extends BaseDoc {
  event: ObjectId;
  x: number;
  y: number;
}

/**
 * concept: Map
 */
export default class MapConcept {
  public readonly maps: DocCollection<MapDoc>;
  public readonly pins: DocCollection<PinDoc>;

  /**
   * Make an instance of a Map.
   */
  constructor(collectionName: string) {
    this.maps = new DocCollection<MapDoc>(collectionName);
    this.pins = new DocCollection<PinDoc>(collectionName + "_pins");
  }

  async createMap() {
    let x: number = 0;
    let y: number = 0;
    const _id = await this.maps.createOne({ x, y });
    return { msg: "Map created successfully!", map: await this.maps.readOne({ _id }) };
  }

  async getMap(_id: ObjectId) {
    const map = await this.maps.readOne({ _id});
    if (map === null) {
      throw new NotFoundError(`Map not found!`);
    }
    return map;
  }

  async scroll(_id: ObjectId, x_scroll: number, y_scroll: number) {
    let map = await this.maps.readOne({ _id});

    if (map !== null) {
      let x = Number(map.x) + Number(x_scroll);
      let y = Number(map.y) + Number(y_scroll);
      await this.maps.partialUpdateOne({ _id }, { x, y });
      return { msg: "Successfully scrolled!" };
    }
  }

  async makePin(event: ObjectId, x: number, y: number) {
    const _id = await this.pins.createOne({ event, x, y });
    return { msg: "Pin created successfully!", pin: await this.pins.readOne({ _id }) };
  }

  async getPinEventId(_id: ObjectId) {
    let pin = await this.pins.readOne({ _id});
    return pin?.event;
  }
}