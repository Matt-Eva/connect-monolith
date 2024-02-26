import { useState } from "react";
import { Link } from "react-router-dom";

import CardImageIcon from "../CardImageIcon/CardImageIcon";

import { ConnectionArray } from "../../types/connection";

import styles from "./ChatCard.module.css";

function ChatCard({
  chatId,
  users,
  unread,
}: {
  chatId: string;
  users: ConnectionArray;
  unread: boolean;
}) {
  const [isTruncated, setIsTruncated] = useState(true);

  const userNameArray = users.map((user) => user.firstName);

  const userImages = [];

  for (let i = 0; i < users.length && i < 4; i++) {
    userImages.push({
      name: users[i].name,
      profileImg: users[i].profileImg,
      uId: users[i].uId,
      firstName: users[i].firstName,
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
