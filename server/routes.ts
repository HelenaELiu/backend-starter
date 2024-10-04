import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Friending, Posting, Sessioning, Inviting, Events } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import { EventDoc } from "./concepts/events";
import Responses from "./responses";

import { z } from "zod";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  //video routes

  @Router.post("/video")
  async createVideo(session: SessionDoc, data: Array<number>, description: string) {
    return undefined;
  }

  @Router.post("/video")
  async watchVideo(session: SessionDoc, id: string) {
    return undefined;
  }

  @Router.post("/video")
  async deleteVideo(session: SessionDoc, id: string) {
    return undefined;
  }

  //organization routes

  @Router.post("/organizations")
  async createOrg(session: SessionDoc, name: string) {
    return undefined;
  }

  @Router.post("/organizations")
  async deleteOrg(session: SessionDoc, name: string) {
    return undefined;
  }

  @Router.post("/organizations")
  async updateOrgName(session: SessionDoc, name: string) {
    return undefined;
  }

  @Router.post("/organizations")
  async updateOrgDescription(session: SessionDoc, description: string) {
    return undefined;
  }

  @Router.post("/organizations")
  async addMember(session: SessionDoc, member: string) {
    return undefined;
  }

  @Router.post("/organizations")
  async deleteMember(session: SessionDoc, member: string) {
    return undefined;
  }

  @Router.post("/organizations")
  async makePublic(session: SessionDoc, name: string) {
    return undefined;
  }

  @Router.post("/organizations")
  async makePrivate(session: SessionDoc, name: string) {
    return undefined;
  }

  //map routes

  @Router.post("/map")
  async scrollMap(session: SessionDoc, x: number, y: number) { 
    //x and y are how far the user has scrolled from their previous location on the map
    return undefined;
  }

  @Router.post("/map")
  async dropPins(session: SessionDoc, x: Array<number>, y: Array<number>) { 
    //x and y are the location of the pins to drop
    return undefined;
  }

  @Router.post("/map")
  async tapPin(session: SessionDoc, x: number, y: number) { 
    //x and y are location of pin
    return undefined;
  }

  @Router.post("/map")
  async untapPin(session: SessionDoc, x: number, y: number) { 
    //x and y are location of pin
    return undefined;
  }

  //event routes

  @Router.post("/event")
  async createEvent(session: SessionDoc, name: string, time: Date, location: string, choreographers: Set<string>,
    genres: Set<string>, props: Set<string>, price: number, description: string, attendees: Set<string>) {
    const user = Sessioning.getUser(session);
    return await Events.createEvent(user, name, time, location, choreographers,
      genres, props, price, description, attendees);
  }

  @Router.post("/event")
  async deleteEvent(event: EventDoc) {
    const eventOid = await Events.getEvent(event);
    return await Events.deleteEvent(eventOid)
  }

  @Router.post("/event")
  async updateEventName(event: EventDoc, name: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.updateName(eventOid, name)
  }

  @Router.post("/event")
  async updateEventTime(event: EventDoc, time: Date) {
    const eventOid = await Events.getEvent(event);
    return await Events.updateTime(eventOid, time)
  }

  @Router.post("/event")
  async updateEventLocation(event: EventDoc, location: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.updateLocation(eventOid, location)
  }

  @Router.post("/event")
  async updateEventPrice(event: EventDoc, price: number) {
    const eventOid = await Events.getEvent(event);
    return await Events.updatePrice(eventOid, price)
  }

  @Router.post("/event")
  async updateEventDescription(event: EventDoc, description: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.updateDescription(eventOid, description)
  }

  @Router.post("/event")
  async addChoreog(event: EventDoc, choreog: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.addChoreog(eventOid, choreog)
  }

  @Router.post("/event")
  async deleteChoreog(event: EventDoc, choreog: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.deleteChoreog(eventOid, choreog)
  }

  @Router.post("/event")
  async addGenre(event: EventDoc, genre: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.addGenre(eventOid, genre)
  }

  @Router.post("/event")
  async deleteGenre(event: EventDoc, genre: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.deleteGenre(eventOid, genre)
  }

  @Router.post("/event")
  async addProp(event: EventDoc, prop: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.addProp(eventOid, prop)
  }

  @Router.post("/event")
  async deleteProp(event: EventDoc, prop: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.deleteProp(eventOid, prop)
  }

  @Router.post("/event")
  async addAttendee(event: EventDoc, attendee: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.addAttendee(eventOid, attendee)
  }

  @Router.post("/event")
  async deleteAttendee(event: EventDoc, attendee: string) {
    const eventOid = await Events.getEvent(event);
    return await Events.deleteAttendee(eventOid, attendee)
  }

  //invite routes

  @Router.post("/invite/:to")
  async sendInvite(session: SessionDoc, to: string, event: EventDoc) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    const eventOid = await Events.getEvent(event);
    return await Inviting.sendInvite(eventOid, user, toOid);
  }

  @Router.delete("/invite/:to")
  async removeInvite(session: SessionDoc, to: string, event: EventDoc) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    const eventOid = await Events.getEvent(event);
    return await Inviting.removeInvite(eventOid, user, toOid);
  }

  @Router.put("/invite/accept/:from")
  async acceptInvite(session: SessionDoc, from: string, event: EventDoc) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    const eventOid = await Events.getEvent(event);
    return await Inviting.acceptInvite(eventOid, user, fromOid);
  }

  @Router.put("/invite/reject/:from")
  async rejectInvite(session: SessionDoc, from: string, event: EventDoc) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    const eventOid = await Events.getEvent(event);
    return await Inviting.rejectInvite(eventOid, user, fromOid);
  }

}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
