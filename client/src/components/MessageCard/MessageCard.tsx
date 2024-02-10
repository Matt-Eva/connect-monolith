import CardImageIcon from "../CardImageIcon/CardImageIcon";

import styles from "./MessageCard.module.css";

function MessageCard({
  name,
  profileImg,
  text,
  uId,
}: {
  name: string;
  profileImg: string;
  text: string;
  uId: string;
}) {
  return (
    <article className={styles.messageCard}>
      <div className={styles.imageContainer}>
        <CardImageIcon users={[{ name, profileImg, uId }]} />
      </div>
      <span>{name}</span>
      <p className={styles.messageContent}>{text}</p>
    </article>
  );
}

export default MessageCard;
