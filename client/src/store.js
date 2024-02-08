import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state/user";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
