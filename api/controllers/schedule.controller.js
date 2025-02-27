const Subject = require("../models/subject.model");
const Student = require("../models/student.model");
const Exam = require("../models/examination.model");
const Schedule = require("../models/schedule.model");
module.exports = {
  getScheduleWithSemester: async (req, res) => {
    try {
      const departmentId = req.user.departmentId;
      const semesterId = req.params.id;
      const schedules = await Schedule.find({
        department: departmentId,
        semester: semesterId,
      });
      res.status(200).json({
        success: true,
        message: "success in fetching all schedule",
        data: schedules,
      });
    } catch (error) {
      console.log("get schedule error", error);
      res
        .status(500)
        .json({ success: false, message: "server error in getting schedule" });
    }
  },

   createSchedule: async (req, res) => {
    try {
      console.log("Received Request Data:", req.body); // ✅ Log received data
      console.log("User Data:", req.user); // ✅ Log user data to verify departmentId
  
      const newSchedule = new Schedule({
        department: req.user.departmentId,  // Ensure department is stored
        teacher: req.body.teacher,
        subject: req.body.subject,
        semester: req.body.semester,  // Ensure semester is stored
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
  
      await newSchedule.save();
      res.status(200).json({ success: true, message: "Schedule created successfully", data: newSchedule });
    } catch (err) {
      console.error("Error creating Schedule:", err); // ✅ Log errors
      res.status(500).json({ success: false, message: "Server error in creating schedule" });
    }
  },
  
  updateScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Schedule.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "successfully updated Schedule",
        data: scheduleAfterUpdate,
      });
    } catch (error) {
      console.log("updating Schedule error", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in updating Schedule" });
    }
  },

  deleteScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let departmentId = req.user.departmentId;

      await Schedule.findOneAndDelete({ _id: id, department: departmentId });
      res
        .status(200)
        .json({ success: true, message: "successfully deleted Schedule" });
    } catch (error) {
      console.log("deleting Schedule error", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in deleting Schedule" });
    }
  },
};
