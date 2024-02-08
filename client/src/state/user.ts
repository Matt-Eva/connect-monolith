import { createSlice } from "@reduxjs/toolkit";

export interface User {
  name: string;
  firstName: string;
  uId: string;
  email: string;
  profileImg: string;
  lastName: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: false,
  },
  reducers: {
    createUser: (userState, action) => {
      userState.value = action.payload;
    },
    destroyUser: (userState) => {
      userState.value = false;
    },
  },
});

export const { createUser, destroyUser } = userSlice.actions;

export default userSlice.reducer;
