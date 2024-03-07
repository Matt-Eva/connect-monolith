import { useState } from "react";
import { Link } from "react-router-dom";

import CardImageIcon from "../CardImageIcon/CardImageIcon";

import { ConnectionArray } from "../../types/connection";

import styles from "./ChatCard.module.css";

function ChatCard({
  chatId,
  participants,
  unread,
}: {
  chatId: string;
  participants: ConnectionArray;
  unread: boolean;
}) {
  const [isTruncated, setIsTruncated] = useState(true);

  const userNameArray = participants.map((user) => user.firstName);

  const userImages = [];

  for (let i = 0; i < participants.length && i < 4; i++) {
    userImages.push({
      name: participants[i].name,
      profileImg: participants[i].profileImg,
      uId: participants[i].uId,
      firstName: participants[i].firstName,
    });
  }

  const userNames = userNameArray.join(", ");

  const nameClass = isTruncated ? styles.namesTruncated : styles.allNames;

  return (
    <article className={`${styles.card}`}>
      <div className={styles.imageContainer}>
        <CardImageIcon users={userImages} />
      </div>
      {unread ? <span className={styles.unread}>unread</span> : null}
      <span
        className={nameClass}
        title={userNames}
        onClick={() => setIsTruncated(!isTruncated)}
      >
        {userNames}
      </span>
      <Link to={`/chat/${chatId}`} className={`underlined-link ${styles.link}`}>
        open chat
      </Link>
    </article>
  );
}

export default ChatCard;
