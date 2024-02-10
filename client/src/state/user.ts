import { createSlice } from "@reduxjs/toolkit";

export interface User {
  name: string;
  firstName: string;
  uId: string;
  email: string;
  profileImg: string;
  lastName: string;
  authenticated: boolean;
}

const initialUserState: User = {
  name: "",
  firstName: "",
  uId: "",
  email: "",
  profileImg: "",
  lastName: "",
  authenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: initialUserState,
  },
  reducers: {
    createUser: (userState, action) => {
      userState.value = { ...action.payload, authenticated: true };
    },
    destroyUser: (userState) => {
      userState.value = initialUserState;
    },
  },
});

export const { createUser, destroyUser } = userSlice.actions;

export default userSlice.reducer;
