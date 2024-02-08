import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import ConnectionCard from "../../components/ConnectionCard/ConnectionCard";

import styles from "./MyConnections.module.css";

import { fetchConnections } from "./UtilsMyConnections";

function MyConnections() {
  const user = useSelector((state) => state.user.value);
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      fetchConnections({ setConnections });
    }
  }, [user]);

  const filterUsers = (e) => {
    setSearch(e.target.value);
  };

  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().startsWith(search.toLowerCase())
  );

  const displayConnections = filteredConnections.map((connection) => (
    <ConnectionCard key={connection.uId} {...connection} />
  ));

  return (
    <div className={styles.container}>
      <label className={styles.searchLabel}>browse your connections</label>
      <input
        type="text"
        placeholder="Browse connections..."
        className={styles.search}
        onChange={filterUsers}
      />
      {displayConnections}
    </div>
  );
}

export default MyConnections;
