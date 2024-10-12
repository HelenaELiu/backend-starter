import AuthenticatingConcept from "./concepts/authenticating";
import FriendingConcept from "./concepts/friending";
import PostingConcept from "./concepts/posting";
import SessioningConcept from "./concepts/sessioning";
import InvitingConcept from "./concepts/inviting";
import EventConcept from "./concepts/events";
import OrganizationConcept from "./concepts/organizations";
import VideoConcept from "./concepts/videos";
import MapConcept from "./concepts/map";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Inviting = new InvitingConcept("invites");
export const Events = new EventConcept("events");
export const Organizations = new OrganizationConcept("organizations");
export const Videos = new VideoConcept("videos");
export const Map = new MapConcept("map");