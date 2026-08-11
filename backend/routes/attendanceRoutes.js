const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getAttendanceById,
  getAttendanceByStudent,
  getAttendanceByTimetable,
  getAttendancePercentage,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

// ====================================
// CREATE
// ====================================

router.post("/", markAttendance);

// ====================================
// READ
// ====================================

router.get("/", getAttendance);

router.get(
  "/student/:studentId",
  getAttendanceByStudent
);

router.get(
  "/timetable/:timetableId",
  getAttendanceByTimetable
);

router.get(
  "/percentage/:studentId",
  getAttendancePercentage
);

router.get(
  "/:id",
  getAttendanceById
);

// ====================================
// UPDATE
// ====================================

router.put("/:id", updateAttendance);

// ====================================
// DELETE
// ====================================

router.delete("/:id", deleteAttendance);

module.exports = router;