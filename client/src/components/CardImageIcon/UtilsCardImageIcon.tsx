import { CardImageIconUserArray } from "./TypesCardImageIcon";

import styles from "./CardImageIcon.module.css";

const renderImages = ({ users }: { users: CardImageIconUserArray }) => {
  const length: number = users.length;

  let imageClass = "";
  let letterClass = "";

  if (length === 1) {
    imageClass = styles.singleImage;
    letterClass = styles.singleLetter;
  } else {
    imageClass = styles.multiImage;
    letterClass = styles.multiLetter;
  }

  const images = users.map((user, index) => {
    let gridClass = "";
    if (length === 2 && index === 1) {
      gridClass = styles.bottomRight;
    } else if (length === 3 && index === 2) {
      gridClass = styles.bottomMiddle;
    }

    if (!user.profileImg) {
      let colorClass = "";

      if (index === 0) {
        colorClass = "bg-blue";
      } else if (index === 1) {
        colorClass = "bg-purple";
      } else if (index === 2) {
        colorClass = "bg-green";
      } else {
        colorClass = "bg-red";
      }

      return (
        <div
          className={`${styles.roundImage} center-text ${letterClass} ${gridClass} ${colorClass}`}
          key={user.uId}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return (
        <img
          src={user.profileImg}
          className={`${imageClass} ${styles.roundImage}
            ${gridClass}`}
          key={user.uId}
        />
      );
    }
  });

  return images;
};

export { renderImages };
