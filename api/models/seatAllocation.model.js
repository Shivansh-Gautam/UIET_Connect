const mongoose = require('mongoose');

const seatAllocationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examination: { type: mongoose.Schema.Types.ObjectId, ref: 'Examination', required: true },
  seatNumber: { type: Number, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  allocatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SeatAllocation', seatAllocationSchema);
