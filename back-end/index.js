// Import statements for CommonJS
const express = require("express");
const db = require("mongoose");
const http = require("http");
const socketio = require("socket.io"); // socket.io doesn't need to be destructured like in ES modules
const cors = require("cors");
const ConnectDB = require("./db/db.js"); // Use .js since it's now CommonJS
const dotenv = require("dotenv");
const router = require("./Routes/Room.route.js"); // Use .js for CommonJS
const path = require("path");
const { dirname } = require("path");
const { fileURLToPath } = require("url");
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/auth.js'); // Use .js for CommonJS

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server); // No need to destructure `Server` in CommonJS

app.use(
  cors({
    origin: true, // Replace with your React app's origin if different
    credentials: true, // Allow cookies to be sent
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these methods
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes); // Auth routes (signup, login)

dotenv.config();

app.use(router);

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}

io.on("connect", () => {});

app.use(cookieParser());
app.use(errorHandler);

server.listen(process.env.PORT || 3003, () => {
  console.log(process.env.PORT || 3003);
  ConnectDB();
  console.log("App is running on port 3000");
});
