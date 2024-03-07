import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Post } from "../types/post";

const initialPostState: Post[] = [];

export const myPostsSlice = createSlice({
  name: "posts",
  initialState: {
    value: {
      myPosts: initialPostState,
      isFetched: false,
    },
  },
  reducers: {
    setMyPosts: (postsState, action) => {
      postsState.value.myPosts = action.payload;
      postsState.value.isFetched = true;
    },
    updateMyPostSecondaryContent: (postsState, action) => {
      postsState.value.myPosts = postsState.value.myPosts.map((myPost) => {
        if (myPost.post.mongoId === action.payload.mongoId) {
          return {
            ...myPost,
            post: {
              ...myPost.post,
              secondaryContent: action.payload.secondaryContent,
            },
          };
        } else {
          return myPost;
        }
      });
    },
    clearMyPosts: (postsState) => {
      postsState.value.myPosts = initialPostState;
      postsState.value.isFetched = false;
    },
  },
});

export const { setMyPosts, updateMyPostSecondaryContent, clearMyPosts } =
  myPostsSlice.actions;

export default myPostsSlice.reducer;
