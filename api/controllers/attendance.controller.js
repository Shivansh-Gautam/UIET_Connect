const mongoose = require("mongoose");
const Attendance = require("../models/attendance.model");
const Student = require("../models/student.model");
const Subject = require("../models/subject.model");
const ExcelJS = require("exceljs");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

module.exports = {
  // Check attendance for a specific semester
  checkAttendance: async (req, res) => {
    try {
      const { semesterId } = req.params;

      // Find subjects in semester and user's department
      const subjects = await Subject.find({ student_class: semesterId, department: req.user.departmentId });

      const attendanceData = {};

      for (const subject of subjects) {
        const attendanceRecords = await Attendance.find({ subject: subject._id })
          .populate('student')
          .lean();

        attendanceData[subject.subject_name] = attendanceRecords.map(record => ({
          studentName: `${record.student.first_name} ${record.student.last_name}`,
          status: record.status,
          date: record.date,
        }));
      }

      res.status(200).json({ success: true, data: attendanceData });
    } catch (error) {
      console.log("Error checking attendance", error);
      res.status(500).json({ success: false, message: "Server error checking attendance" });
    }
  },

  // Generate attendance PDF for a subject and date
  generateAttendancePDF: async (req, res) => {
    try {
      const { subjectId, date } = req.params;

      // Find subject and verify department
      const subject = await Subject.findOne({ _id: subjectId, department: req.user.department });
      if (!subject) {
        return res.status(404).json({ success: false, message: "Subject not found or access denied" });
      }

      // Find attendance records for subject and date
      const attendanceRecords = await Attendance.find({ subject: subjectId, date: date })
        .populate('student')
        .lean();

      const attendanceData = attendanceRecords.map(record => ({
        studentName: `${record.student.first_name} ${record.student.last_name}`,
        status: record.status,
        date: record.date,
      }));

      res.status(200).json({ success: true, data: attendanceData });
    } catch (error) {
      console.log("Error fetching attendance data", error);
      res.status(500).json({ success: false, message: "Server error fetching attendance data" });
    }
  },

  // Fetch attendance data for a specific student
  getAttendance: async (req, res) => {
    try {
      const { studentId } = req.params;

      // Find student and verify department
      const student = await Student.findOne({ _id: studentId, department: req.user.department });
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      const attendanceRecords = await Attendance.find({ student: studentId })
        .populate('subject')
        .lean();

      const attendanceData = attendanceRecords.map(record => ({
        subjectName: record.subject.subject_name,
        semester: record.subject.student_class ? record.subject.student_class.semester_text : "Unknown Semester",
        status: record.status,
        date: record.date,
      }));

      res.status(200).json({ success: true, data: attendanceData });
    } catch (error) {
      console.log("Error fetching attendance for student", error.message);
      console.log(error.stack);
      res.status(500).json({ success: false, message: "Server error fetching attendance for student" });
    }
  },

  // Record attendance for a student
  recordAttendance: async (req, res) => {
    try {
      const { subjectId, date, attendanceData } = req.body;

      if (!subjectId || !date || !Array.isArray(attendanceData) || attendanceData.length === 0) {
        return res.status(400).json({ success: false, message: "Missing required fields or attendance data" });
      }

      for (const record of attendanceData) {
        const { studentId, status } = record;
        if (!studentId || status == null) {
          return res.status(400).json({ success: false, message: "Missing studentId or status in attendance data" });
        }

        const existingRecord = await Attendance.findOne({ student: studentId, subject: subjectId, date: date });
        if (existingRecord) {
          existingRecord.status = status;
          await existingRecord.save();
        } else {
          const attendance = new Attendance({
            student: studentId,
            subject: subjectId,
            status,
            date,
          });
          await attendance.save();
        }
      }

      res.status(201).json({ success: true, message: "Attendance recorded successfully" });
    } catch (error) {
      console.log("Error recording attendance", error);
      res.status(500).json({ success: false, message: "Server error recording attendance" });
    }
  },
 
  // Get attendance records metadata with PDF info
  getAttendanceRecordsWithPDF: async (req, res) => {
    try {
      // Example: Fetch attendance records with some PDF metadata (adjust as needed)
      // Assuming there is a field or collection that stores PDF info related to attendance records
      // For demonstration, fetching all attendance records with student and subject populated

      const attendanceRecords = await Attendance.find()
        .populate('student', 'first_name last_name')
        .populate('subject', 'subject_name')
        .lean();

      // Map to include PDF info if available (dummy example)
      const recordsWithPDF = attendanceRecords.map(record => ({
        studentName: `${record.student.first_name} ${record.student.last_name}`,
        subjectName: record.subject.subject_name,
        date: record.date,
        status: record.status,
        pdfGenerated: record.pdfGenerated || false, // Assuming a field pdfGenerated exists
      }));

      res.status(200).json({ success: true, data: recordsWithPDF });
    } catch (error) {
      console.log("Error fetching attendance records with PDF info", error);
      res.status(500).json({ success: false, message: "Server error fetching attendance records with PDF info" });
    }
  }
};
