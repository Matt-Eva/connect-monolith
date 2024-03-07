import { createSlice } from "@reduxjs/toolkit";

export const startingPathSlice = createSlice({
  name: "startingPath",
  initialState: {
    value: "/",
  },
  reducers: {
    setStartingPath: (startingPathState, action) => {
      startingPathState.value = action.payload;
    },
  },
});

export const { setStartingPath } = startingPathSlice.actions;

export default startingPathSlice.reducer;
