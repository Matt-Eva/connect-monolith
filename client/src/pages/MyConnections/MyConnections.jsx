import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import ConnectionCard from "../../components/ConnectionCard/ConnectionCard";

import styles from "./MyConnections.module.css";

import { setConnections } from "../../state/connections";

import { fetchConnections } from "./UtilsMyConnections";

function MyConnections() {
  const connectionsState = useSelector((state) => state.connections.value);
  console.log(connectionsState);
  const connections = connectionsState.connections;
  const isFetched = connectionsState.isFetched;

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isFetched) {
      fetchConnections({ setConnections, dispatch });
    }
  }, []);

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
