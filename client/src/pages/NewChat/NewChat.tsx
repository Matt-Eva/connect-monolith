import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";

import CreateChatUserCard from "../../components/CreateChatUserCard/CreateChatUserCard.jsx";
import ParticipantCard from "../../components/ParticipantCard/ParticipantCard.jsx";

import { setConnections } from "../../state/connections.js";
import { addChat } from "../../state/chats.js";

import { ConnectionArray, Connection } from "../../types/connection";

import styles from "./NewChat.module.css";

import {
  fetchConnections,
  createChat,
  filterConnections,
} from "./UtilsNewChat.js";

function NewChat() {
  const connectionsState = useAppSelector((state) => state.connections.value);
  const connections: ConnectionArray = connectionsState.connections;
  const isFetched = connectionsState.isFetched;
  const dispatch = useAppDispatch();

  const [participants, setParticipants] = useState<ConnectionArray>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  console.log(participants);

  useEffect(() => {
    if (!isFetched) {
      fetchConnections({ setConnections, setLoading, dispatch });
    } else {
      setLoading(false);
    }
  }, []);

  const addParticipant = (user: Connection) => {
    console.log("adding participant");
    if (participants.find((participant) => participant.uId === user.uId))
      return;
    setParticipants([...participants, user]);
    setSearch("");
  };

  const removeParticipant = (uId: string) => {
    const oneLess = participants.filter(
      (participant) => participant.uId !== uId
    );
    setParticipants(oneLess);
  };

  const handleCreateChat = () => {
    createChat({ participants, navigate, dispatch, addChat });
  };

  const filteredConnections: ConnectionArray = filterConnections({
    connections,
    participants,
    search,
  });

  const displayConnections = filteredConnections.map((connection) => (
    <CreateChatUserCard
      key={connection.uId}
      user={connection}
      addParticipant={addParticipant}
    />
  ));

  const displayParticipants = participants.map((participant) => {
    return (
      <ParticipantCard
        key={participant.uId}
        name={participant.name}
        uId={participant.uId}
        removeParticipant={removeParticipant}
      />
    );
  });

  return (
    <section className={styles.newChat}>
      <div className={styles.searchContainer}>
        <label htmlFor="search" className={styles.searchLabel}>
          Browse connections{" "}
        </label>
        <input
          type="text"
          value={search}
          name="search"
          placeholder="Browse connections..."
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <button onClick={handleCreateChat} className={styles.createChat}>
          Create Chat
        </button>
      </div>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <div className={styles.participantContainer}>
            {displayParticipants}
          </div>
          <div className={styles.connectionContainer}>{displayConnections}</div>
        </>
      )}
    </section>
  );
}

export default NewChat;
