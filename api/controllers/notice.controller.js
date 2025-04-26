const Notice = require("../models/notice.model");

module.exports = {
  getAllNotices: async (req, res) => {
    try {
      const department = req.user.department;
      const allNotices = await Notice.find({ department: department });
      res.status(200).json({
        success: true,
        message: "success in fetching all notice",
        data: allNotices,
      });
    } catch (error) {
      console.log("getallnotices error", error);
      res
        .status(500)
        .json({ success: false, message: "server error in getting classes" });
    }
  },
  getTeacherNotices: async (req, res) => {
    try {
      const department = req.user.department;
      const allNotices = await Notice.find({ department: department, audience:"teacher" });
      res.status(200).json({
        success: true,
        message: "success in fetching all notice",
        data: allNotices,
      });
    } catch (error) {
      console.log("getallnotices error", error);
      res
        .status(500)
        .json({ success: false, message: "server error in getting classes" });
    }
  },
  getStudentNotices: async (req, res) => {
    try {
      const department = req.user.department;
      const year = req.query.year;
      let query = { department: department, audience: "student" };
      if (year) {
        query.year = year;
      }
      const allNotices = await Notice.find(query);
      res.status(200).json({
        success: true,
        message: "success in fetching all notice",
        data: allNotices,
      });
    } catch (error) {
      console.log("getallnotices error", error);
      res
        .status(500)
        .json({ success: false, message: "server error in getting classes" });
    }
  },

  createNotice: async (req, res) => {
    try {
      const { title, message, audience, year } = req.body;
      const newNotice = new Notice({
        department: req.user.department,
        title: title,
        message: message,
        audience: audience,
        year: year || null,
      });

      await newNotice.save();
      res
        .status(200)
        .json({ success: true, message: "successfully created notice" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Server error in creating notice" });
    }
  },
  updateNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;
      // Sanitize year field: remove or set to null if empty string
      const updateData = { ...req.body };
      if (updateData.year === "") {
        updateData.year = null;
      }
      await Notice.findOneAndUpdate({ _id: id }, { $set: updateData });
      const noticeAfterUpdate = await Notice.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "successfully updated notice",
        data: noticeAfterUpdate,
      });
    } catch (error) {
      console.log("updating notice error", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in updating notice" });
    }
  },

  deleteNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let department = req.user.department;

        await Notice.findOneAndDelete({ _id: id, department: department});
        res
          .status(200)
          .json({ success: true, message: "successfully deleted notice" });
      
    } catch (error) {
      console.log("deleting notice error", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in deleting notice" });
    }
  },
};
