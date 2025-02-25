const express = require("express");
const authMiddleware = require("../auth/auth");
const { createNotice, getAllNotices, updateNoticeWithId, deleteNoticeWithId } = require("../controllers/notice.controller");

const router = express.Router();

router.post("/create", authMiddleware(["DEPARTMENT"]), createNotice);
router.get("/all", authMiddleware(["DEPARTMENT"]), getAllNotices);
router.patch(
  "/update/:id",
  authMiddleware(["DEPARTMENT"]),
  updateNoticeWithId
);
router.get("/delete/:id", authMiddleware(["DEPARTMENT"]), deleteNoticeWithId);

module.exports = router;