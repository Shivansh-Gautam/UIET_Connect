const mongoose = require("mongoose");

const scheduleschema = new mongoose.Schema({
  department: { type: mongoose.Schema.ObjectId, ref: "Department" },
  teacher: { type: mongoose.Schema.ObjectId, ref: "Teacher" },
  subject: { type: mongoose.Schema.ObjectId, ref: "Subject" },
  semester: { type: mongoose.Schema.ObjectId, ref: "Semester" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

module.exports = mongoose.model("Schedule", scheduleschema);
