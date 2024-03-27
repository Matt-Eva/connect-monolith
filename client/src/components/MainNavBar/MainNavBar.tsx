import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../reduxHooks";

import styles from "./MainNavBar.module.css";

function MainNavBar() {
  const user = useAppSelector((state) => state.user.value);
  return (
    <>
      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <NavLink to="/">chats</NavLink>
          <NavLink to="/people">people</NavLink>
          <NavLink to="/posts">posts</NavLink>
        </nav>
      </footer>
      <section className={styles.sidebar}>
        <nav className={styles.sidenav}>
          <ul className={styles.outerList}>
            <li className={styles.outerListItem}>
              chats
              <ul className={styles.innerList}>
                <li>
                  <NavLink to="/" className="underlined-link">
                    my chats
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/new-chat" className="underlined-link">
                    new chat
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className={styles.outerListItem}>
              people
              <ul className={styles.innerList}>
                <li>
                  <NavLink to="/people" className="underlined-link">
                    search
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/people/my-connections"
                    className="underlined-link"
                  >
                    my connections
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/people/invitations" className="underlined-link">
                    invitations
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className={styles.outerListItem}>
              posts
              <ul className={styles.innerList}>
                <li>
                  <NavLink to="/posts" className="underlined-link">
                    feed
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/posts/new" className="underlined-link">
                    new post
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/profile/${user.uId}`}
                    className="underlined-link"
                  >
                    my posts
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </section>
    </>
  );
}

export default MainNavBar;
