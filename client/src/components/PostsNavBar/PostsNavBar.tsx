import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../reduxHooks";

import styles from "./PostsNavBar.module.css";

function PostsNavBar() {
  const user = useAppSelector((state) => state.user.value);
  console.log(user);
  return (
    <nav className={styles.nav}>
      <NavLink to="/posts">feed</NavLink>
      <NavLink to="/posts/new">new post</NavLink>
      <NavLink to={`/profile/${user.uId}`}>my posts</NavLink>
    </nav>
  );
}

export default PostsNavBar;
