require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.broadcast.to(data.room).emit("receive_message", data);
  });

  socket.on("send_data", (data) => {
    socket.broadcast.to(data.room).emit("receive_data", data);
  });
});

server.listen(process.env.SOCKET_PORT || 5001, () => {
  console.log("SERVER IS RUNNING");
});
