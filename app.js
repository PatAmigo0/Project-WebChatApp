import crypto from "crypto";
import express from "express";
import session from "express-session";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

import db from "./db/ramDb.js";
import User from "./model/user.js";
import routes from "./route/routes.js";
import wsService from "./service/wsService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_INSTANCE_TOKEN = crypto.randomUUID();
const PORT = process.env.PORT || 3000;

const sessionMiddleware = session({
  secret: "its not a secret =(",
  resave: false,
  saveUninitialized: true,
});

const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({ server: httpServer });

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
    // wsService.onMessage ожидает строку, а 'message' в ws v8 - это Buffer.
    // Преобразуем его в строку.
    wsService.onMessage(ws, user, message.toString());
  });

  ws.on("close", () => {
    wsService.onClose(ws, user);
  });
});

// Запуск сервера
httpServer.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});
