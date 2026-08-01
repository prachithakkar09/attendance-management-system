const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getAttendanceById,
  getAttendanceByStudent,
  getAttendanceBySubject,
  getAttendancePercentage,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

// CREATE
router.post("/", markAttendance);

// READ
router.get("/", getAttendance);
router.get("/student/:studentId", getAttendanceByStudent);
router.get("/subject/:subjectId", getAttendanceBySubject);
router.get("/percentage/:studentId", getAttendancePercentage);
router.get("/:id", getAttendanceById);

// UPDATE
router.put("/:id", updateAttendance);

// DELETE
router.delete("/:id", deleteAttendance);

module.exports = router;