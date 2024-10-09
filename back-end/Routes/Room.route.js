const express = require("express");
// const controller = require("../db/Controlers");
const { deleteRoom, updateRoom, AddRoom, getAllRooms, getRoom } = require("../db/Controlers/Room.controle.js");
const router = express.Router();

router.get("/", getAllRooms);
router.get("/:id", getRoom);
router.post("/addRoom", AddRoom);
router.patch("/updateRoom", updateRoom);
router.delete('/deleteRoom/:id', deleteRoom);

module.exports = router;


