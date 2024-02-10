import styles from "./CardImageIcon.module.css";

import { ConnectionArray } from "../../types/connection";

import { renderImages } from "./UtilsCardImageIcon";

function CardImageIcon({ users }: { users: ConnectionArray }) {
  const images = renderImages({ users });

  return <div className={styles.icon}>{images}</div>;
}

export default CardImageIcon;
