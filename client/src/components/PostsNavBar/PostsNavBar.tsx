import { NavLink } from "react-router-dom";

import styles from "./PostsNavBar.module.css";

function PostsNavBar() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/posts">feed</NavLink>
      <NavLink to="/posts/new">new post</NavLink>
    </nav>
  );
}

export default PostsNavBar;
