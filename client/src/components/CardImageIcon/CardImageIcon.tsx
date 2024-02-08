import styles from "./CardImageIcon.module.css";

import { Connection } from "../../state/connections";

import { renderImages } from "./UtilsCardImageIcon";

function CardImageIcon({ users }: { users: [Connection] }) {
  const images = renderImages({ users });

  return <div className={styles.icon}>{images}</div>;
}

export default CardImageIcon;
