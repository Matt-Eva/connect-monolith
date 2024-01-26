const { server, app } = require("./config/appConfig.js");
const { io, handleConnection } = require("./config/socketIoConfig.js");
const path = require("path");

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});

io.on("connection", handleConnection);

app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});
