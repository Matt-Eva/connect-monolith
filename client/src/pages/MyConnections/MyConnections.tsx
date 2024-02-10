import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../reduxHooks";

import ConnectionCard from "../../components/ConnectionCard/ConnectionCard";

import styles from "./MyConnections.module.css";

import { setConnections } from "../../state/connections";

import { fetchConnections } from "./UtilsMyConnections";

function MyConnections() {
  const connectionsState = useAppSelector((state) => state.connections.value);
  const isFetched = connectionsState.isFetched;

  interface Connection {
    firstName: string;
    name: string;
    uId: string;
    profileImg: string;
  }
  type Connections = Connection[];
  const connections: Connections = connectionsState.connections;

  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isFetched) {
      fetchConnections({ setConnections, dispatch });
    }
  }, []);

  const filterUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
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
