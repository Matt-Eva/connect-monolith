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
    addPost: (postsState, action) => {
      postsState.value.myPosts = [action.payload, ...postsState.value.myPosts];
    },
    removePost: (postsState, action) => {
      console.log(action.payload);
      postsState.value.myPosts = postsState.value.myPosts.filter((myPost) => {
        console.log(myPost.post.mongoId === action.payload);
        return myPost.post.mongoId !== action.payload;
      });
      console.log(postsState.value.myPosts);
    },
  },
});

export const {
  setMyPosts,
  updateMyPostSecondaryContent,
  clearMyPosts,
  addPost,
  removePost,
} = myPostsSlice.actions;

export default myPostsSlice.reducer;
