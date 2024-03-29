import { useState } from "react";
import { Link } from "react-router-dom";

import CardImageIcon from "../CardImageIcon/CardImageIcon";

import { ConnectionArray } from "../../types/connection";

import styles from "./BlockedUserCard.module.css";

function BlockedUserCard({
  name,
  profileImg,
  firstName,
  uId,
}: {
  name: string;
  firstName: string;
  profileImg: string;
  uId: string;
}) {
  const [blocked, setBlocked] = useState(true);

  const iconUser: ConnectionArray = [
    {
      name,
      firstName,
      profileImg,
      uId,
    },
  ];

  const unblock = async () => {
    try {
      const res = await fetch(`/api/unblock-user/${uId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setBlocked(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article className={`${styles.card}`}>
      <CardImageIcon users={iconUser} />
      <p className={styles.name}>{name}</p>
      {blocked ? (
        <button onClick={unblock} className={`bg-red`}>
          unblock
        </button>
      ) : (
        <span>unblocked</span>
      )}
      <Link to={`/profile/${uId}`} className={`underlined-link`}>
        view profile
      </Link>
    </article>
  );
}

export default BlockedUserCard;
