import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateChatUserCard from "../../components/CreateChatUserCard/CreateChatUserCard.jsx";
import ParticipantCard from "../../components/ParticipantCard/ParticipantCard.jsx";

import styles from "./NewChat.module.css";

import {
  fetchConnections,
  createChat,
  filterConnections,
} from "./UtilsNewChat.js";

function NewChat() {
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections({ setConnections, setLoading });
  }, []);

  const addParticipant = (user) => {
    if (participants.find((participant) => participant.uId === user.uId))
      return;
    setParticipants([...participants, user]);
    setSearch("");
  };

  const removeParticipant = (uId) => {
    const oneLess = participants.filter(
      (participant) => participant.uId !== uId
    );
    setParticipants(oneLess);
  };

  const handleCreateChat = () => {
    createChat({ participants, navigate });
  };

  const filteredConnections = filterConnections({
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
        <label hmtlfor="search" className={styles.searchLabel}>
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
