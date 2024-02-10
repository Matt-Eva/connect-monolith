import { useState } from "react";
import { Link } from "react-router-dom";

import CardImageIcon from "../CardImageIcon/CardImageIcon";

import { SearchResult } from "../../types/userSearch";

import styles from "./NewConnectionCard.module.css";

import { addConnection, acceptInvitation } from "./UtilsNewConnectionCard";

function NewConnectionCard({
  name,
  uId,
  pending,
  invited,
  profileImg,
}: SearchResult) {
  const [pendingInvite, setPendingInvite] = useState(pending);
  const [connected, setConnected] = useState(false);

  const handleAddConnection = () => {
    addConnection({ uId, setPendingInvite });
  };

  const handleAcceptInvitation = () => {
    acceptInvitation({ uId, setConnected });
  };

  const iconUser = [
    {
      firstName: name,
      name,
      profileImg,
      uId,
    },
  ];

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <CardImageIcon users={iconUser} />
      </div>
      <span className={styles.name} title={name}>
        {name}
      </span>
      {pendingInvite ? (
        <span> Invitation Pending</span>
      ) : invited ? (
        connected ? (
          <span className={styles.connected}> Connected</span>
        ) : (
          <button onClick={handleAcceptInvitation} className={styles.button}>
            {" "}
            Accept Invitation
          </button>
        )
      ) : (
        <button onClick={handleAddConnection} className={styles.button}>
          connect
        </button>
      )}
      <Link to={`/profile/${uId}`} className={styles.link}>
        view profile
      </Link>
    </article>
  );
}

export default NewConnectionCard;
