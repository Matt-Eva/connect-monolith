import { useEffect } from "react";

function EnableNotifications() {
  const publicVapidKey =
    "BMZvid0dkRQW8pkamKz_q6KnxlxTo-QpyUUpRwNk6JS3zLpfIMyd3Lm_KRkVZSn1E4q1CwjjZtRtiTAdS6siXUc";

  const postSubscription = async (subscription) => {
    try {
      const response = await fetch("/api/notification-subscription", {
        method: "POST",
        body: JSON.stringify({ subscription: subscription }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const enableSubscription = async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service workers are not supported in this browser");
      }

      const registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        throw new Error("No service worker is registered.");
      }

      if (!("PushManager" in window)) {
        throw new Error("Push messaging is not supported.");
      }

      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        console.log("Already subscribed to push notifications");

        await postSubscription(subscription);
      } else {
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicVapidKey,
        });

        console.log("subscribed to push notifications", newSubscription);

        await postSubscription(newSubscription);
      }
    } catch (error) {
      console.error("Error setting up push notifications" + error);
    }
  };

  const enableNotifications = async () => {
    try {
      const result = await Notification.requestPermission();
      console.log(result);
      if (result === "granted") {
        enableSubscription();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={enableNotifications}>Turn on Notifications</button>
      <p>
        By turning on notifications, you'll receive notifications on your device
        if you've installed this app.
      </p>
    </div>
  );
}

export default EnableNotifications;
