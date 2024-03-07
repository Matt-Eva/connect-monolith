import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import routes from "./routes";
import { store } from "./store";

import "./index.css";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription && registration.active) {
      registration.active.postMessage({
        type: "focusState",
        isFocused: true,
      });

      const notifications = await registration.getNotifications();
      for (let i = 0; i < notifications.length; i += 1) {
        notifications[i].close();
      }

      document.addEventListener("visibilitychange", async () => {
        if (!document.hidden && registration.active) {
          registration.active.postMessage({
            type: "focusState",
            isFocused: true,
          });

          const notifications = await registration.getNotifications();
          for (let i = 0; i < notifications.length; i += 1) {
            notifications[i].close();
          }
        } else if (registration.active) {
          registration.active.postMessage({
            type: "focusState",
            isFocused: false,
          });
        }
      });
    } else {
    }
  });
}
