import PeopleNavBar from "../../components/PeopleNavBar/PeopleNavBar";
import { Outlet, useOutletContext } from "react-router-dom";
import styles from "./People.module.css";

function People() {
  const { user } = useOutletContext();

  const outletContext = { user };

  return (
    <main className={styles.main}>
      <Outlet context={outletContext} />
      <PeopleNavBar />
    </main>
  );
}

export default People;
