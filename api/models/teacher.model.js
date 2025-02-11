const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.ObjectId, ref: "Department" },
  email: { type: String, required: true },
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  department_image: { type: string, required: true },
  password: { type: string, required: true },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Teacher", teacherSchema);
