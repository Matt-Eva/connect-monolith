import { Outlet } from "react-router-dom";

import PostsNavBar from "../../components/PostsNavBar/PostsNavBar";

import styles from "./Posts.module.css";

function Posts() {
  return (
    <main className={styles.main}>
      <Outlet />
      <PostsNavBar />
    </main>
  );
}

export default Posts;
