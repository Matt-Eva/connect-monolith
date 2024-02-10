import { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      name: string;
      email: string;
      firstName: string;
      lastName: string;
      profileImg: string;
      uId: string;
    };
  }
}
