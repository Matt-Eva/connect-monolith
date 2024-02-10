import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ConnectionArray } from "../types/connection";

interface Chats {
  [key: string]: ConnectionArray;
}

const initialChatState: Chats = {
  uId: [],
};

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
  },
});

export const { setChats, addChat, removeChat } = chatsSlice.actions;

export default chatsSlice.reducer;
