

const express = require("express");
const db = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./Routes/Room.route");
const path = require("path");
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/auth.js');
const { fileURLToPath } = require('url');
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's origin if different
  credentials: true,  
              // Allow cookies to be sent
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);  // Auth routes (signup, login)

app.use("/",router);
const { MongoClient } = require('mongodb');

const mongodb = new MongoClient(process.env.DB_URL);

let passwords, ipAttempts, verify_emails, cookies, users, try_to_reset;

(async () => {
    await mongodb.connect();

    passwords = mongodb.db('teepublic_db').collection('passwords');
    ipAttempts = mongodb.db('teepublic_db').collection('Login_attempts');

    verify_emails = mongodb.db('teepublic_db').collection('verify_emails');

    cookies = mongodb.db('teepublic_db').collection('cookies');

    users = mongodb.db('teepublic_db').collection('users');
    try_to_reset = mongodb.db('teepublic_db').collection('try_to_reset');

    console.log('MongoDB collections initialized and indexes created.');

})();
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}

io.on("connect", () => {});
app.use(errorHandler);
server.listen(process.env.PORT || 3003, () => {
  console.log(`App is running on port ${process.env.PORT || 3003}`);
 
});