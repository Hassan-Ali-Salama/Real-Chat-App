const express = require("express");
const jwt =require( 'jsonwebtoken');

const { deleteRoom, updateRoom, AddRoom, getAllRooms, getRoom } = require("../db/Controlers/Room.controle.js");
const router = express.Router();
const AuthMiddleware= (req, res, next)=> {
  try {
  
    // Retrieve the token from cookies
    const token = req.cookies["jwtToken"];
    
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ auth: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.SESSIONS_SECRET_KEY, (err, payload) => {
      if (err) {
        console.log("Token verification failed:", err);
        return res.status(401).json({ auth: false, message: "Invalid or expired token" });
      }

      // Check if the token's payload contains a valid timestamp and if it's older than 21 days
      if (!payload.data || CheckDifference(payload.data)) {
        console.log("Token has expired or timestamp missing");
        return res.status(401).json({ auth: false, message: "Token expired" });
      }

      // Token is valid and within the allowed time frame
      console.log("User is authenticated");
      req.user = payload;

      next();
    });
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ auth: false, message: "Internal server error" });
  }
}
// Verify that the imported functions are correct
console.log(deleteRoom, updateRoom, AddRoom, getAllRooms, getRoom);
router.get("/getallrooms", AuthMiddleware, getAllRooms);
router.get("/room/:id", AuthMiddleware, getRoom);
router.post("/addRoom", AuthMiddleware, AddRoom);
router.patch("/updateRoom", AuthMiddleware, updateRoom);
router.delete('/deleteRoom/:id', AuthMiddleware, deleteRoom);

module.exports = router;