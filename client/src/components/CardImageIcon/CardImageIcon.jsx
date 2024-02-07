import styles from "./CardImageIcon.module.css";
import { renderImages } from "./UtilsCardImageIcon";

function CardImageIcon({ users }) {
  const images = renderImages({ users });

  return <div className={styles.icon}>{images}</div>;
}

export default CardImageIcon;
