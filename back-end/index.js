const express = require("express");
const db = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const ConnectDB = require("./db/db");
const dotenv = require("dotenv");
const router = require("./Routes/Room.route");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
dotenv.config();

app.use(router);



io.on("connect", () => {});

server.listen(process.env.PORT || 3000, () => {
  console.log(process.env.Port);
  ConnectDB()
  console.log("App is running on port 3000");
});
