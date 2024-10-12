import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface EventDoc extends BaseDoc {
  author: ObjectId,
  name: string;
  time: string;
  location: string;
  price: number;
  description: string;
  choreographers: string[];
  genres: string[];
  props: string[];
  attendees: string[]; //array of usernames
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

  async createEvent(author: ObjectId, name: string, time: string, location: string, price: number, 
    description: string) {
    let choreographers: string[] = [];
    let genres: string[] = [];
    let props: string[] = [];
    let attendees: string[] = [];
    const _id = await this.events.createOne({author, name, time, location, price, description, 
      choreographers, genres, props, attendees});
    return { msg: "Event created successfully!", event: await this.events.readOne({ _id }) };
  }

  async deleteEvent(_id: ObjectId) {
    await this.events.deleteOne({ _id });
    return { msg: "Event deleted successfully!" };
  }

  async getEvent(_id: ObjectId) {
    const event = await this.events.readOne({ _id });
    if (event === null) {
      throw new NotFoundError(`Event not found!`);
    }
    return event;
  }

  async getAllEvents() {
    return await this.events.readMany({}, { sort: { _id: -1 } });
  }

  async updateEvent(_id: ObjectId, name?: string, time?: string, location?: string, price?: number, description?: string) {
    await this.events.partialUpdateOne({ _id }, { name, time, location, price, description });
    return { msg: "Event successfully updated!" };
  }

  async addChoreog(_id: ObjectId, choreog: string) {
    let event = await this.events.readOne({ _id });
    let choreographers = event?.choreographers;

    if (choreographers !== undefined && !choreographers.includes(choreog)) {
      choreographers.push(choreog);
      await this.events.partialUpdateOne({ _id }, { choreographers });
    }
    return { msg: "Event choreog successfully added!" };
  }

  async deleteChoreog(_id: ObjectId, choreog: string) {
    let event = await this.events.readOne({ _id });
    let choreographers = event?.choreographers;

    if (choreographers !== undefined && choreographers.includes(choreog)) {
      const index = choreographers.indexOf(choreog, 0);
      choreographers.splice(index, 1);
      await this.events.partialUpdateOne({ _id }, { choreographers });
      return { msg: "Event choreog successfully deleted!" };
    } else {
      throw new Error('Choreographer not in choreographers list!');
    }
  }

  async addGenre(_id: ObjectId, genre: string) {
    let event = await this.events.readOne({ _id });
    let genres = event?.genres;

    if (genres !== undefined && !genres.includes(genre)) {
      genres.push(genre);
      await this.events.partialUpdateOne({ _id }, { genres });
    }
    return { msg: "Event genre successfully added!" };
  }

  async deleteGenre(_id: ObjectId, genre: string) {
    let event = await this.events.readOne({ _id });
    let genres = event?.genres;

    if (genres !== undefined && genres.includes(genre)) {
      const index = genres.indexOf(genre, 0);
      genres.splice(index, 1);
      await this.events.partialUpdateOne({ _id }, { genres });
      return { msg: "Event genre successfully deleted!" };
    } else {
      throw new Error('Genre not in genres list!');
    }
  }

  async addProp(_id: ObjectId, prop: string) {
    let event = await this.events.readOne({ _id });
    let props = event?.props;

    if (props !== undefined && !props.includes(prop)) {
      props.push(prop);
      await this.events.partialUpdateOne({ _id }, { props });
    }
    return { msg: "Event prop successfully added!" };
  }

  async deleteProp(_id: ObjectId, prop: string) {
    let event = await this.events.readOne({ _id });
    let props = event?.props;

    if (props !== undefined && props.includes(prop)) {
      const index = props.indexOf(prop, 0);
      props.splice(index, 1);
      await this.events.partialUpdateOne({ _id }, { props });
      return { msg: "Event prop successfully deleted!" };
    } else {
      throw new Error('Prop not in props list!');
    }
  }

  async addAttendee(_id: ObjectId, attendee: string) {
    let event = await this.events.readOne({ _id });
    let attendees = event?.attendees;

    if (attendees !== undefined && !attendees.includes(attendee)) {
      attendees.push(attendee);
      await this.events.partialUpdateOne({ _id }, { attendees });
    }
    return { msg: "Event attendee successfully added!" };
  }

  async deleteAttendee(_id: ObjectId, attendee: string) {
    let event = await this.events.readOne({ _id });
    let attendees = event?.attendees;

    if (attendees !== undefined && attendees.includes(attendee)) {
      const index = attendees.indexOf(attendee, 0);
      attendees.splice(index, 1);
      await this.events.partialUpdateOne({ _id }, { attendees });
      return { msg: "Event attendee successfully deleted!" };
    } else {
      throw new Error('Attendee not in attendee list!');
    }
  }

  async assertUserNotAttendee(_id: ObjectId, user: ObjectId) {
    const event = await this.events.readOne({ _id });
    if (!event) {
      throw new NotFoundError(`Event ${_id} does not exist!`);
    }
    if (event.attendees.includes(user.toString())) {
      throw new AlreadyEventAttendeeError(user, _id);
    }
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const event = await this.events.readOne({ _id });
    if (!event) {
      throw new NotFoundError(`Event ${_id} does not exist!`);
    }
    if (event.author.toString() !== user.toString()) {
      throw new EventAuthorNotMatchError(user, _id);
    }
  }
}

export class EventAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of event {1}!", author, _id);
  }
}

export class AlreadyEventAttendeeError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is already attending event {1}!", author, _id);
  }
}