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
    const register = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
  });
}
