import styles from "./EnableNotifications.module.css";
import { enableNotifications } from "./UtilsEnableNotifications";

function EnableNotifications() {
  return (
    <main className={styles.main}>
      <button onClick={enableNotifications}>Turn on Notifications</button>
      <p>
        By turning on notifications, you'll receive notifications on your device
        if you've installed this app.
      </p>
    </main>
  );
}

export default EnableNotifications;
