const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.ObjectId, ref: "Department" },
  teacher: { type: mongoose.Schema.ObjectId, ref: "Teacher" },
  subject: { type: mongoose.Schema.ObjectId, ref: "Subject" },
  semester: { type: mongoose.Schema.ObjectId, ref: "Semester" },
  startTime: { type: Date, require: true },
  endTime: { type: Date, require: true },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
