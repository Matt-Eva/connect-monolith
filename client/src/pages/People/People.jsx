import PeopleNavBar from "../../components/PeopleNavBar/PeopleNavBar";
import { Outlet } from "react-router-dom";

import styles from "./People.module.css";

function People() {
  return (
    <main className={styles.main}>
      <Outlet />
      <PeopleNavBar />
    </main>
  );
}

export default People;
