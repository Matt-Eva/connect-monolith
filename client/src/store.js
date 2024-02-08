import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state/user";
import startingPathReducer from "./state/startingPath";

export default configureStore({
  reducer: {
    user: userReducer,
    startingPath: startingPathReducer,
  },
});
