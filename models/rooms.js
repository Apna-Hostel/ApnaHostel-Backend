const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNo: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
    default: 1
  },
  available: {
    type: String,
    required: true,
    default: 1
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
});

const Rooms = mongoose.model("Room", roomSchema);

module.exports = Rooms;
