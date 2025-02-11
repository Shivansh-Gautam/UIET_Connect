const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.ObjectId, ref: "Department" },
  email: { type: String, required: true },
  name: { type: String, required: true },
  student_class: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  guardian: { type: string, required: true },
  guardian_phone: { type: string, required: true },
  student_image: { type: string, required: true },
  password: { type: string, required: true },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Student", studentSchema);
