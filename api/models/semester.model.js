const mongoose = require("mongoose");

const semesterschema = new mongoose.Schema({
  department: { type: mongoose.Schema.ObjectId, ref: "Department" },
  semester_text: { type: String, required: true },
  semester_num: { type: Number, required: ture },
  attendee: { type: mongoose.Schema.ObjectId, ref: "Teacher" },
  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Semester", semesterschema);
