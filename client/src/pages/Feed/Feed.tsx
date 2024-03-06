import { useState, useEffect } from "react";

import PostCard from "../../components/PostCard/PostCard";

import styles from "./Feed.module.css";

export interface Post {
  uId: string;
  mongoId: string;
  mainPostLinksText: string[];
  mainPostLinksLinks: string[];
  mainPostContent: string;
  secondaryContent: boolean;
}

export interface Neo4jPost {
  post: Post;
  username: string;
  userId: string;
}
function Feed() {
  const [posts, setPosts] = useState<Neo4jPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const postCards = posts.map((post) => (
    <PostCard
      key={post.post.uId}
      post={post.post}
      username={post.username}
      userId={post.userId}
    />
  ));
  return <div>{postCards}</div>;
}

export default Feed;
