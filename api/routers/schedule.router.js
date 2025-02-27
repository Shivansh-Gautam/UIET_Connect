const express = require("express");
const authMiddleware = require("../auth/auth");
const { createSchedule, getScheduleWithSemester, updateScheduleWithId, deleteScheduleWithId } = require("../controllers/schedule.controller");

const router = express.Router();

router.post("/create",authMiddleware(['DEPARTMENT']), createSchedule );
router.get("/fetch-with-semester/:id",authMiddleware(['DEPARTMENT']), getScheduleWithSemester);
router.patch("/update/:id",authMiddleware(["DEPARTMENT"]), updateScheduleWithId);
router.delete("/delete/:id",authMiddleware(["DEPARTMENT"]),deleteScheduleWithId);


module.exports = router;


