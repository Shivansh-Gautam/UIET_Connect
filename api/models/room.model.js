const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
});

module.exports = mongoose.model('Room', roomSchema);
