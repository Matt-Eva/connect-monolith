import express from "express";
import path from "path";
import http from "http";
import router from "../router";
import sessionMiddleware from "./sessionConfig";

const app = express();

app.use(sessionMiddleware);

app.use(express.json());

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use("/api", router);

const server = http.createServer(app);

module.exports = {
  server,
  app,
  express,
};
