const express = require("express");
const RoomModel = require("../Models/Room.model");

const app = express();

const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find();
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    const roomData = room.toObject();

    res.status(200).json({ success: true, data: roomData });
  } catch (error) {
    console.log(error);
  }
};

const AddRoom = async (req, res) => {
  const room = req.body;
  if (!room.name) {
    res.status(400).json({ success: false, message: "error in posting" });
  }

  const newRoom = new RoomModel(room);

  try {
    await newRoom.save().then(() => {
      console.log("room added successfully");
      res.status(201).json({ success: true, data: newRoom });
    });
  } catch (error) {
    console.log("Error in creating product:", error.message);
  }
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const updateRoom = req.body;
  const room = await ProductModel.findById(id);
  room = updateRoom;
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await RoomModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Room not found" });
    console.log("error");
  }
};

module.exports = {
  getAllRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  AddRoom,
};
