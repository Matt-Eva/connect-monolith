import { createSlice } from "@reduxjs/toolkit";

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    value: {
      connections: [],
      isFetched: false,
    },
  },
  reducers: {
    setConnections: (connectionsState, action) => {
      connectionsState.value.connections = action.payload;
      connectionsState.value.isFetched = true;
    },
  },
});

export const { setConnections } = connectionsSlice.actions;

export default connectionsSlice.reducer;
