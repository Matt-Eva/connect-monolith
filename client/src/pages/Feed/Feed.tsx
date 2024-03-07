import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../reduxHooks";

import PostCard from "../../components/PostCard/PostCard";

import { setPosts } from "../../state/posts";

import styles from "./Feed.module.css";

function Feed() {
  const postsState = useAppSelector((state) => state.posts.value);
  const posts = postsState.posts;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      dispatch(setPosts(data));
    };
    if (!postsState.isFetched) {
      fetchPosts();
    }
  }, []);

  const postCards = posts.map((post) => (
    <PostCard
      editable={false}
      key={post.post.uId}
      post={post.post}
      username={post.username}
      userId={post.userId}
    />
  ));
  return <div>{postCards}</div>;
}

export default Feed;
