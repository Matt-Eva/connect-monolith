import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ConnectionArray } from "../types/connection";

interface Chats {
  [key: string]: {
    unread: boolean;
    users: ConnectionArray;
  };
}

const initialChatState: Chats = {};

export const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    value: {
      chats: initialChatState,
      isFetched: false,
    },
  },
  reducers: {
    setChats: (chatsState, action) => {
      chatsState.value.chats = action.payload;
      chatsState.value.isFetched = true;
    },
    addChat: (chatsState, action) => {
      const oneMoreChat = {
        ...chatsState.value.chats,
        [action.payload.chatId]: action.payload.participants,
      };
      chatsState.value.chats = oneMoreChat;
    },
    removeChat: (chatsState, action: PayloadAction<string>) => {
      const key = action.payload;
      const oneLess: { [key: string]: any } = { ...chatsState.value.chats };
      delete oneLess[key];
      chatsState.value.chats = oneLess;
    },
    clearChats: (chatsState) => {
      chatsState.value = { chats: initialChatState, isFetched: false };
    },
    markChatRead: (chatsState, action: PayloadAction<string>) => {
      const chatId = action.payload;
      chatsState.value.chats[chatId] = {
        ...chatsState.value.chats[chatId],
        unread: false,
      };
    },
  },
});

export const { setChats, addChat, removeChat, clearChats, markChatRead } =
  chatsSlice.actions;

export default chatsSlice.reducer;
