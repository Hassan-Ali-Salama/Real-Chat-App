const express = require("express");
const db = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const ConnectDB = require("./db/db");
const dotenv = require("dotenv");
const router = require("./Routes/Room.route");
const axios = require("axios");
const { updateRoom } = require("./db/Controlers/Room.controle");
const app = express();
const server = http.createServer(app);
const Room = require("../back-end/db/Models/Room.model");
const io = socketio(server, {
  cors: {
    origin: "*", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
dotenv.config();

app.use(router);
app.use(
  cors({
    origin: "*", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connect", (socket) => {
  socket.on("connection", () => {
    console.log("someone is connected");
  });

  socket.on("join", async ({ userName, roomid, callback }) => {
    console.log("someone is joined");
    roomid = "66fd4d3d872bc33b0fd6d49d";
    userName = "mohamed";
    try {
      const room = await Room.findById(roomid);
      console.log(room);
      if (room) {
        if (room.users.includes(userName)) {
          console.log("user name is used");
        } else {
          room.users.push(userName);
          room.save();
        }
      }
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(process.env.Port);
  ConnectDB();
  console.log("App is running on port 3000");
});
