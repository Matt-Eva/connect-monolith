import ChatNavBar from "../../components/ChatNavBar/ChatNavBar";
import { Outlet } from "react-router-dom";

import styles from "./BrowseChats.module.css";

function BrowseChats() {
  return (
    <main className={styles.main}>
      <Outlet />
      <ChatNavBar />
    </main>
  );
}

export default BrowseChats;
