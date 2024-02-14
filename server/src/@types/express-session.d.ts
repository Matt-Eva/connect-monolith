import { SessionData } from "express-session";
import { User } from "./sessionUser";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}
