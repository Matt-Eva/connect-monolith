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
    updatePostSecondaryContent: (postsState, action) => {
      postsState.value.posts = postsState.value.posts.map((post) => {
        if (post.post.mongoId === action.payload.mongoId) {
          return {
            ...post,
            post: {
              ...post.post,
              secondaryContent: action.payload.secondaryContent,
            },
          };
        } else {
          return post;
        }
      });
    },
  },
});

export const { setPosts, updatePostSecondaryContent } = postsSlice.actions;

export default postsSlice.reducer;
