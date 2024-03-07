import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../reduxHooks";

import CardImageIcon from "../CardImageIcon/CardImageIcon";

import styles from "./ConnectionCard.module.css";

import { addChat } from "../../state/chats";

function ConnectionCard({
  name,
  uId,
  profileImg,
  firstName,
}: {
  name: string;
  uId: string;
  profileImg: string;
  firstName: string;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  console.log(firstName);

  const startChat = async () => {
    const body = {
      participants: [{ uId: uId }],
    };

    const res = await fetch("/api/new-chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const newChat = await res.json();
      const participants = [{ name, uId, profileImg, firstName }];
      dispatch(addChat({ chatId: newChat.uId, participants }));
      navigate(`/chat/${newChat.uId}`);
    }
  };

  const iconUser = [
    {
      name: name,
      firstName: name,
      profileImg,
      uId,
    },
  ];

  return (
    <article className={`userCard ${styles.card}`}>
      <div className={styles.imageContainer}>
        <CardImageIcon users={iconUser} />
      </div>
      <span title={name} className={styles.name}>
        {name}
      </span>
      <button className={styles.button} onClick={startChat}>
        Chat
      </button>
      <Link to={`/profile/${uId}`} className={`underlined-link ${styles.link}`}>
        view profile
      </Link>
    </article>
  );
}

export default ConnectionCard;

// 54a3a1e1-50b7-4c7d-a8a4-4b9e6e914664
