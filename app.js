const express = require("express");
const session = require("express-session");
const http = require("http");
const WebSocket = require("ws");
const db = require("./db/ramDb");
const routes = require("./route/routes");
const User = require("./model/user");
const wsService = require("./service/wsService");
const path = require("path");
const crypto = require("crypto");

const SERVER_INSTANCE_TOKEN = crypto.randomUUID();
const PORT = process.env.PORT || 3000;

const sessionMiddleware = session({
  secret: "its not a secret =(",
  resave: false,
  saveUninitialized: true,
});

const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer });

db.loadTestData();

app.use(sessionMiddleware);
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

app.use("/api/v1", routes);

app.get("/api/v1/server-token", (req, res) => {
  res.json({ serverInstanceToken: SERVER_INSTANCE_TOKEN });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Обработка WebSocket
wsServer.on("connection", (ws) => {
  ws.send(
    JSON.stringify({
      type: "server_instance_token",
      token: SERVER_INSTANCE_TOKEN,
    })
  );

  const user = new User(null, null);

  ws.on("message", (message) => {
    wsService.onMessage(ws, user, message);
  });

  ws.on("close", () => {
    wsService.onClose(ws, user);
  });
});

// Запуск сервера
httpServer.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});
