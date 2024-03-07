import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Post } from "../types/post";

const initialPostState: Post[] = [];

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    value: {
      posts: initialPostState,
      isFetched: false,
    },
  },
  reducers: {
    setPosts: (postsState, action) => {
      postsState.value.posts = action.payload;
      postsState.value.isFetched = true;
    },
  },
});

export const { setPosts } = postsSlice.actions;

export default postsSlice.reducer;
