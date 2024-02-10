import styles from "./CardImageIcon.module.css";

import { CardImageIconUserArray } from "./TypesCardImageIcon";

import { renderImages } from "./UtilsCardImageIcon";

function CardImageIcon({ users }: { users: CardImageIconUserArray }) {
  const images = renderImages({ users });

  return <div className={styles.icon}>{images}</div>;
}

export default CardImageIcon;
