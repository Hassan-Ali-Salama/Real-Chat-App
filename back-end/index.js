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
const { MongoClient } = require('mongodb');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// MongoDB connection
const mongodb = new MongoClient(process.env.DB_URL);

let passwords, ipAttempts, verify_emails, cookies, users, try_to_reset;

(async () => {
    await mongodb.connect();

    const db = mongodb.db('teepublic_db');
    passwords = db.collection('passwords');
    ipAttempts = db.collection('Login_attempts');
    verify_emails = db.collection('verify_emails');
    cookies = db.collection('cookies');
    users = db.collection('users');
    try_to_reset = db.collection('try_to_reset');

    console.log('MongoDB collections initialized and indexes created.');
})();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use( router);

// Serve React app
const buildPath = path.join("./front-end", 'build');
app.use(express.static("./front-end/build"));
app.get('/', (req, res) => {
  res.sendFile(path.join("./front-end/build", 'index.html'));
});

// Fallback to index.html for React Router

// Error handling middleware
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}

app.use(errorHandler);

// Socket.IO setup
io.on("connect", (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
