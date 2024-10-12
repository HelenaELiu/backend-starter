import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Friending, Posting, Sessioning, Inviting, Events, Organizations, Videos, Map } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  //sessioning + authing routes

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

  //post routes

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

  //friend routes

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

  //videos routes

  @Router.post("/videos")
  async createVideo(session: SessionDoc, url: string, description: string) {
    const user = Sessioning.getUser(session);
    return await Videos.createVideo(user, url, description);
  }

  @Router.get("/videos/:id")
  async getVideo(id: string) {
    const oid = new ObjectId(id);
    return await Videos.getVideo(oid);
  }

  @Router.get("/videos")
  async getAllVideos() {
    return await Videos.getAllVideos();
  }

  @Router.delete("/videos/:id")
  async deleteVideo(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Videos.assertAuthorIsUser(oid, user);
    return await Videos.deleteVideo(oid);
  }

  //organizations routes

  @Router.post("/organizations")
  async createOrg(session: SessionDoc, name: string, description: string, privacy: boolean) {
    const user = Sessioning.getUser(session);
    return await Organizations.createOrg(user, name, description, privacy);
  }

  @Router.delete("/organizations/:id")
  async deleteOrg(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Organizations.assertAuthorIsUser(oid, user);
    return await Organizations.deleteOrg(oid);
  }

  @Router.patch("/organizations/:id")
  async updateOrg(session: SessionDoc, id: string, name?: string, description?: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Organizations.assertAuthorIsUser(oid, user);
    return await Organizations.updateOrg(oid, name, description);
  }

  @Router.get("/organizations/:id")
  async getOrg(id: string) {
    const oid = new ObjectId(id);
    return await Organizations.getOrg(oid);
  }

  @Router.get("/organizations")
  async getAllOrgs() {
    return await Organizations.getAllOrgs();
  }

  @Router.patch("/organizations/addmember/:id")
  async addMember(session: SessionDoc, id: string, member: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Organizations.assertAuthorIsUser(oid, user);
    return await Organizations.addMember(oid, member);
  }

  @Router.patch("/organizations/deletemember/:id")
  async deleteMember(session: SessionDoc, id: string, member: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Organizations.assertAuthorIsUser(oid, user);
    return await Organizations.deleteMember(oid, member);
  }

  @Router.patch("/organizations/makepublic/:id")
  async makePublic(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Organizations.assertAuthorIsUser(oid, user);
    return await Organizations.makePublic(oid);
  }

  @Router.patch("/organizations/makeprivate/:id")
  async makePrivate(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Organizations.assertAuthorIsUser(oid, user);
    return await Organizations.makePrivate(oid);
  }

  //map routes

  @Router.post("/map")
  async createMap() { 
    return await Map.createMap();
  }

  @Router.get("/map")
  async getMap(id: string) { 
    const oid = new ObjectId(id);
    return await Map.getMap(oid);
  }

  @Router.patch("/map")
  async scrollMap(id: string, x_scroll: number, y_scroll: number) { 
    //x and y are how far the user has scrolled from their previous location on the map
    const oid = new ObjectId(id);
    return await Map.scroll(oid, x_scroll, y_scroll);
  }

  @Router.post("/map/pins")
  async makePin(event_id: string, x: number, y: number) { 
    //x and y is the location of the pin to drop, event is the corresponding event
    const eventOid = new ObjectId(event_id);
    return await Map.makePin(eventOid, x, y);
  }

  @Router.get("/map/pins/:id")
  async getPinEventId(pin_id: string) { 
    const pinOid = new ObjectId(pin_id);
    return await Map.getPinEventId(pinOid);    
  }

  //events routes

  @Router.post("/events")
  async createEvent(session: SessionDoc, name: string, time: string, location: string, price: number, description: string) {
    const user = Sessioning.getUser(session);
    return await Events.createEvent(user, name, time, location, price, description);
  }

  @Router.delete("/events/:id")
  async deleteEvent(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.deleteEvent(oid);
  }

  @Router.get("/events/:id")
  async getEvent(id: string) {
    const eventOid = new ObjectId(id);
    return await Events.getEvent(eventOid);
  }

  @Router.get("/events")
  async getAllEvents() {
    return await Events.getAllEvents();
  }

  @Router.patch("/events/:id")
  async updateEvent(session: SessionDoc, id: string, name?: string, time?: string, location?: string, price?: number, description?: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.updateEvent(oid, name, time, location, price, description);
  }

  @Router.patch("/events/addchoreog/:id")
  async addChoreog(session: SessionDoc, id: string, choreog: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.addChoreog(oid, choreog);
  }

  @Router.patch("/events/deletechoreog/:id")
  async deleteChoreog(session: SessionDoc, id: string, choreog: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.deleteChoreog(oid, choreog);
  }

  @Router.patch("/events/addgenre/:id")
  async addGenre(session: SessionDoc, id: string, genre: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.addGenre(oid, genre);
  }

  @Router.patch("/events/deletegenre/:id")
  async deleteGenre(session: SessionDoc, id: string, genre: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.deleteGenre(oid, genre);
  }

  @Router.patch("/events/addprop/:id")
  async addProp(session: SessionDoc, id: string, prop: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.addProp(oid, prop);
  }

  @Router.patch("/events/deleteprop/:id")
  async deleteProp(session: SessionDoc, id: string, prop: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.deleteProp(oid, prop);
  }

  @Router.patch("/events/addattendee/:id")
  async addAttendee(session: SessionDoc, id: string, attendee: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.addAttendee(oid, attendee);
  }

  @Router.patch("/events/deleteattendee/:id")
  async deleteAttendee(session: SessionDoc, id: string, attendee: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Events.assertAuthorIsUser(oid, user);
    return await Events.deleteAttendee(oid, attendee);
  }

  //invite routes

  @Router.post("/invite/:to")
  async sendInvite(session: SessionDoc, to: string, event_id: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    const eventOid = new ObjectId(event_id);
    await Events.assertUserNotAttendee(eventOid, toOid);
    return await Inviting.sendInvite(eventOid, user, toOid);
  }

  @Router.delete("/invite/:to")
  async removeInvite(session: SessionDoc, to: string, event_id: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    const eventOid = new ObjectId(event_id);
    return await Inviting.removeInvite(eventOid, user, toOid);
  }

  @Router.put("/invite/accept/:from")
  async acceptInvite(session: SessionDoc, from: string, event_id: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    const eventOid = new ObjectId(event_id);
    const msg = await Inviting.acceptInvite(eventOid, fromOid, user);
    await Events.addAttendee(eventOid, user.toString());
    return msg;
  }

  @Router.put("/invite/reject/:from")
  async rejectInvite(session: SessionDoc, from: string, event_id: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    const eventOid = new ObjectId(event_id);
    return await Inviting.rejectInvite(eventOid, fromOid, user);
  }

  @Router.get("/invite")
  async getInvites(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Inviting.getInvites(user);
  }

}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
