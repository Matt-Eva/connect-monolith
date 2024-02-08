import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state/user";
import startingPathReducer from "./state/startingPath";
import chatsReducer from "./state/chats";

export default configureStore({
  reducer: {
    user: userReducer,
    startingPath: startingPathReducer,
    chats: chatsReducer,
  },
});
