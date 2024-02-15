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
    clearConnections: (connectionsState) => {
      connectionsState.value = { connections: [], isFetched: false };
    },
  },
});

export const { setConnections, clearConnections } = connectionsSlice.actions;

export default connectionsSlice.reducer;
