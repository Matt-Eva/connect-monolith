import { server, app } from "./config/appConfig";
import { io, handleConnection } from "./config/socketIoConfig";
import neoDriver from "./config/neo4jConfig";
import path from "path";

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});

io.on("connection", handleConnection);

app.post("/api/notification-subscription", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });
  const subscription = req.body.subscription;
  const user = req.session.user;
  const userId = user.uId;

  if (subscription) {
    const session = neoDriver.session();

    try {
      const query = `
        MATCH (u:User {uId: $userId})
        SET u.subscribed = true, u.subscriptionEndpoint = $endpoint, u.subscriptionp256dh = $p256dh, u.subscriptionAuth = $auth
        RETURN u.subscriptionEndpoint AS endpoint, u.subscriptionp256dh AS p256dh, u.subscriptionAuth AS auth
      `;

      const queryObj = {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      };

      const result = await session.executeWrite((tx) =>
        tx.run(query, queryObj),
      );

      const record = result.records[0];

      const newSubscription = {
        endpoint: record.get("endpoint"),
        expirationTime: null,
        keys: {
          p256dh: record.get("p256dh"),
          auth: record.get("auth"),
        },
      };

      res.status(201).send(newSubscription);
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
    }
  }
});

app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});
