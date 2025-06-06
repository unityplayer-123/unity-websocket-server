const WebSocket = require("ws");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

let sockets = [];

wss.on("connection", function connection(ws) {
  sockets.push(ws);

  ws.on("message", function incoming(message) {
    sockets.forEach(s => {
      if (s !== ws && s.readyState === WebSocket.OPEN) {
        s.send(message);
      }
    });
  });

  ws.on("close", () => {
    sockets = sockets.filter(s => s !== ws);
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server started on ${port}`));
