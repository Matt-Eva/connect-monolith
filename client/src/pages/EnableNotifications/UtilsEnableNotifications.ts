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
      await postSubscription(subscription);
    } else {
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
      });

      await postSubscription(newSubscription);

      const ready = await navigator.serviceWorker.ready;

      ready.active.postMessage({
        type: "focusState",
        isFocused: true,
      });

      document.addEventListener("visibilitychange", async () => {
        if (!document.hidden) {
          ready.active.postMessage({
            type: "focusState",
            isFocused: true,
          });

          const notifications = await ready.getNotifications();
          for (let i = 0; i < notifications.length; i += 1) {
            notifications[i].close();
          }
        } else {
          ready.active.postMessage({
            type: "focusState",
            isFocused: false,
          });
        }
      });
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

export { enableNotifications };
