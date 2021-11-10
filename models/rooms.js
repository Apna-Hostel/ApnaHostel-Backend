const mongoose = require("mongoose");

const roomSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  alloted: {
    type: String,
    required: true,
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
});

const Rooms = mongoose.model("Room", roomSchema);

module.exports = Rooms;
