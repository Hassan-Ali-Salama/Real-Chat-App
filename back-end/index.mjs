import authRoutes from './Routes/auth.mjs';
// Import statements for ES modules
import express from "express";
import db from "mongoose";
import http from "http";
import { Server as socketio } from "socket.io"; // If `Server` is the exported class from socket.io
import cors from "cors";
import ConnectDB from "./db/db.mjs"; // Use .mjs if you have ES modules, else keep it as .js
import dotenv from "dotenv";
import router from "./Routes/Room.route.js"; // Use .mjs extension if necessary
import path from "path";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser'
// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const app = express();
const server = http.createServer(app);
const io =new socketio(server);

app.use(cors({
  origin: true, // Replace with your React app's origin if different
  credentials: true,  
              // Allow cookies to be sent
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);               // Auth routes (signup, login)

dotenv.config();

app.use(router);
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}



io.on("connect", () => {});
app.use(cookieParser());
app.use(errorHandler)
server.listen(process.env.PORT || 3003, () => {
  console.log(process.env.Port);
  ConnectDB()
  console.log("App is running on port 3000");
});
