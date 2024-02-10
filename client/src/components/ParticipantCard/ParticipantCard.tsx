import styles from "./ParticipantCard.module.css";

function ParticipantCard({
  name,
  uId,
  removeParticipant,
}: {
  name: string;
  uId: string;
  removeParticipant: Function;
}) {
  return (
    <div className={styles.participantCard}>
      <span key={uId} className={styles.participant}>
        {name}
      </span>
      <button onClick={() => removeParticipant(uId)} className={`bg-purple`}>
        remove
      </button>
    </div>
  );
}

export default ParticipantCard;
