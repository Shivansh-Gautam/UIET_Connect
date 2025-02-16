const Attendance = require("../models/attendance.model");
const moment = require("moment");

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, semesterId, status } = req.body;
    const { departmentId } = req.user.departmentId;

    const attendance = new Attendance({
      department: departmentId,
      student: studentId,
      date,
      semester: semesterId,
      status,
    });

    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to mark attendance" });
  }
};

// Get attendance by student
exports.getAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId })
      .populate("department")
      .populate("semester")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance records",
    });
  }
};

// Check attendance for a specific date
exports.checkAttendance = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const today = moment().startOf("day");
    const attendanceForToday = await Attendance.findOne({
      semester: semesterId,
      date: {
        $gte: today.toDate(),
        $lt: moment(today).endOf("day").toDate(),
      },
    });

    if (attendanceForToday) {
      res
        .status(200)
        .json({ attendanceToken: true, message: "Attendance already taken" });
    } else {
      res.status(200).json({
        attendanceToken: false,
        message: "Attendance not taken for today yet",
      });
    }
  } catch (error) {
    console.error("Error checking attendance by date:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to check attendance" });
  }
};
