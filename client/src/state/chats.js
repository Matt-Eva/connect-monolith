import { createSlice } from "@reduxjs/toolkit";

export const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    value: {
      chats: {},
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
    removeChat: (chatsState, action) => {
      const key = action.payload;
      const oneLess = { ...chatsState.value.chats };
      delete oneLess[key];
      chatsState.value.chats = oneLess;
    },
  },
});

export const { setChats, addChat, removeChat } = chatsSlice.actions;

export default chatsSlice.reducer;
