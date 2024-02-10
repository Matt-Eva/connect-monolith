import { useState } from "react";
import { Link } from "react-router-dom";

import CardImageIcon from "../CardImageIcon/CardImageIcon";

import styles from "./InvitationCard.module.css";

import { accept, ignore, block } from "./UtilsInvitationCard";

function InvitationCard({
  name,
  uId,
  profileImg,
}: {
  name: string;
  uId: string;
  profileImg: string;
}) {
  const [connected, setConnected] = useState(false);
  const [responded, setResponded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [ignored, setIgnored] = useState(false);

  const handleAccept = () => {
    accept({ uId, setResponded, setConnected });
  };

  const handleIgnore = () => {
    ignore({ uId, setResponded, setIgnored });
  };

  const handleBlock = () => {
    block({ uId, setBlocked, setResponded });
  };

  const iconUser = [
    {
      firstName: name,
      name,
      profileImg,
      uId,
    },
  ];

  return (
    <article className={`${styles.card}`}>
      <div className={styles.imageContainer}>
        <CardImageIcon users={iconUser} />
      </div>
      <span className={styles.name}>{name}</span>
      <Link to={`/profile/${uId}`} className={`underlined-link ${styles.link}`}>
        view profile
      </Link>
      <div className={styles.responseContainer}>
        {responded ? null : (
          <>
            <button onClick={handleBlock} className={`bg-red ${styles.button}`}>
              Block
            </button>
            <button
              onClick={handleIgnore}
              className={`bg-purple ${styles.button}`}
            >
              Ignore
            </button>
            <button onClick={handleAccept} className={`${styles.button}`}>
              Accept
            </button>
          </>
        )}
        {connected ? <span className={styles.response}>Connected</span> : null}
        {blocked ? <span className={styles.response}>Blocked</span> : null}
        {ignored ? <span className={styles.response}>Ignored</span> : null}
      </div>
    </article>
  );
}

export default InvitationCard;
