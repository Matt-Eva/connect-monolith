import CardImageIcon from "../CardImageIcon/CardImageIcon";

import { Connection } from "../../types/connection";

import styles from "./CreateChatUserCard.module.css";

function CreateChatUserCard({
  user,
  addParticipant,
}: {
  user: Connection;
  addParticipant: Function;
}) {
  const iconUser = [
    {
      name: user.name,
      firstName: user.name,
      profileImg: user.profileImg,
      uId: user.uId,
    },
  ];

  return (
    <div className={`userCard ${styles.card}`}>
      <CardImageIcon users={iconUser} />
      <span className={styles.name}>{user.name}</span>
      <button onClick={() => addParticipant(user)}>Add</button>
    </div>
  );
}

export default CreateChatUserCard;
