import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state/user";
import startingPathReducer from "./state/startingPath";
import chatsReducer from "./state/chats";
import connectionsReducer from "./state/connections";

export const store = configureStore({
  reducer: {
    user: userReducer,
    startingPath: startingPathReducer,
    chats: chatsReducer,
    connections: connectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
