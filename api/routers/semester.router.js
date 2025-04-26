const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  getAllSemesters,
  updateSemesterWithId,
  deleteSemesterWithId,
  createSemester,
} = require("../controllers/semester.controller");
const router = express.Router();

router.post("/create", authMiddleware(["DEPARTMENT"]), createSemester);
router.get("/all", authMiddleware(["DEPARTMENT","TEACHER","STUDENT"]), getAllSemesters);
router.patch(
  "/update/:id",
  authMiddleware(["DEPARTMENT"]),
  updateSemesterWithId
);
router.get("/delete/:id", authMiddleware(["DEPARTMENT"]), deleteSemesterWithId);

module.exports = router;