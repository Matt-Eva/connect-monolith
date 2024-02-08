import { useEffect, useState } from "react";

import styles from "./MyInvitations.module.css";

import { fetchInvitations, displayInvitations } from "./UtilsMyInvitations";

function MyInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations({ setInvitations, setLoading });
  }, []);

  const display = displayInvitations({ invitations });

  if (loading) return <h2>Loading...</h2>;

  return <div className={styles.container}>{display}</div>;
}

export default MyInvitations;
