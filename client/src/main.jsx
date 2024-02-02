import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes";
import "./index.css";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

const publicVapidKey =
  "BMZvid0dkRQW8pkamKz_q6KnxlxTo-QpyUUpRwNk6JS3zLpfIMyd3Lm_KRkVZSn1E4q1CwjjZtRtiTAdS6siXUc";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log("this user is subscribed for push notifications!");
      registration.active.postMessage({
        type: "focusState",
        isFocused: true,
      });

      const notifications = await registration.getNotifications();
      for (let i = 0; i < notifications.length; i += 1) {
        console.log(notifications[i], "clearing notification");
        notifications[i].close();
      }
      console.log("focus state true");

      document.addEventListener("visibilitychange", async () => {
        if (!document.hidden) {
          console.log("document visible");
          registration.active.postMessage({
            type: "focusState",
            isFocused: true,
          });

          const notifications = await registration.getNotifications();
          for (let i = 0; i < notifications.length; i += 1) {
            console.log(notifications[i], "clearing notification");
            notifications[i].close();
          }

          console.log("focus state true");
        } else {
          console.log("document hidden");
          registration.active.postMessage({
            type: "focusState",
            isFocused: false,
          });
          console.log("focus state false");
        }
      });
    } else {
      console.log("this user is not yet subscribed for push notifications");
    }
  });
}
