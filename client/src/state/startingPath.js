import { createSlice } from "@reduxjs/toolkit";

export const startingPathSlice = createSlice({
  name: "startingPath",
  initialState: {
    value: "/",
  },
  reducers: {
    setStartingPath: (startingPathState, action) => {
      console.log("from redux", action.payload);
      startingPathState.value = action.payload;
      console.log(startingPathState.value);
    },
  },
});

export const { setStartingPath } = startingPathSlice.actions;

export default startingPathSlice.reducer;
