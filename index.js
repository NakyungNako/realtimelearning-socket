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

  socket.on("send_refresh", (data) => {
    socket.broadcast.to(data.room).emit("receive_refresh", data);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.chat.sender._id) return;

      socket
        .in(newMessageRecieved.room)
        .emit("message recieved", newMessageRecieved);
    });
  });
});

server.listen(process.env.SOCKET_PORT || 5001, () => {
  console.log("SERVER IS RUNNING");
});
