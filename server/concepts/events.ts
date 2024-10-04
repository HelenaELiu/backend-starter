import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface EventDoc extends BaseDoc {
  author: ObjectId,
  name: string;
  time: Date;
  location: string;
  choreographers: Set<string>;
  genres: Set<string>;
  props: Set<string>;
  price: number;
  description: string;
  attendees: Set<string>; //set of usernames, rather than the users themselves
}

/**
 * concept: Events
 */
export default class EventConcept {
  public readonly events: DocCollection<EventDoc>;

  /**
   * Make an instance of an Event.
   */
  constructor(collectionName: string) {
    this.events = new DocCollection<EventDoc>(collectionName);
  }

  async createEvent(author: ObjectId, name: string, time: Date, location: string, choreographers: Set<string>,
    genres: Set<string>, props: Set<string>, price: number, description: string, attendees: Set<string>) {
    const _id = await this.events.createOne({author, name, time, location, choreographers, genres,
      props, price, description, attendees
    });
    return { msg: "Event created successfully!", user: await this.events.readOne({ _id }) };
  }

  async deleteEvent(_id: ObjectId) {
    await this.events.deleteOne({ _id });
    return { msg: "Event deleted successfully!" };
  }

  async getEvent(event: EventDoc) {
    return new ObjectId(event.name);
  }

  async updateName(_id: ObjectId, name: string) {
    await this.events.partialUpdateOne({ _id }, { name });
    return { msg: "Event name successfully updated!" };
  }

  async updateTime(_id: ObjectId, time: Date) {
    await this.events.partialUpdateOne({ _id }, { time });
    return { msg: "Event time successfully updated!" };
  }

  async updateLocation(_id: ObjectId, location: string) {
    await this.events.partialUpdateOne({ _id }, { location });
    return { msg: "Event location successfully updated!" };
  }

  async updatePrice(_id: ObjectId, price: number) {
    await this.events.partialUpdateOne({ _id }, { price });
    return { msg: "Event price successfully updated!" };
  }

  async updateDescription(_id: ObjectId, description: string) {
    await this.events.partialUpdateOne({ _id }, { description });
    return { msg: "Event description successfully updated!" };
  }

  async addChoreog(_id: ObjectId, choreog: string) {
    let event = await this.events.readOne({ _id });
    event?.choreographers.add(choreog)
    return { msg: "Event choreog successfully added!" };
  }

  async deleteChoreog(_id: ObjectId, choreog: string) {
    let event = await this.events.readOne({ _id });
    let choreographers = event?.choreographers;

    if (choreographers !== undefined && choreog in choreographers) {
      event?.choreographers.delete(choreog)
      return { msg: "Event choreog successfully deleted!" };
    } else {
      throw new Error('Choreographer not in choreographers list!');
    }
  }

  async addGenre(_id: ObjectId, genre: string) {
    let event = await this.events.readOne({ _id });
    event?.genres.add(genre)
    return { msg: "Event genre successfully added!" };
  }

  async deleteGenre(_id: ObjectId, genre: string) {
    let event = await this.events.readOne({ _id });
    let genres = event?.genres;

    if (genres !== undefined && genre in genres) {
      event?.genres.delete(genre)
      return { msg: "Event genre successfully deleted!" };
    } else {
      throw new Error('Genre not in genres list!');
    }
  }

  async addProp(_id: ObjectId, prop: string) {
    let event = await this.events.readOne({ _id });
    event?.props.add(prop)
    return { msg: "Event prop successfully added!" };
  }

  async deleteProp(_id: ObjectId, prop: string) {
    let event = await this.events.readOne({ _id });
    let props = event?.props;

    if (props !== undefined && prop in props) {
      event?.props.delete(prop)
      return { msg: "Event prop successfully deleted!" };
    } else {
      throw new Error('Prop not in props list!');
    }
  }

  async addAttendee(_id: ObjectId, attendee: string) {
    let event = await this.events.readOne({ _id });
    event?.attendees.add(attendee)
    return { msg: "Event prop successfully added!" };
  }

  async deleteAttendee(_id: ObjectId, attendee: string) {
    let event = await this.events.readOne({ _id });
    let attendees = event?.attendees;

    if (attendees !== undefined && attendee in attendees) {
      event?.attendees.delete(attendee)
      return { msg: "Event attendee successfully deleted!" };
    } else {
      throw new Error('Attendee not in attendee list!');
    }
  }

  
}
