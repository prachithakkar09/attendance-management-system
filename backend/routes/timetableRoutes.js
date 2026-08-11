const express = require("express");

const {
  getCurrentClass,
  getTodayTimetable,
} = require("../controllers/timetableController");

const router = express.Router();

// ====================================
// GET CURRENT CLASS
// GET /api/timetable/current
// ====================================

router.get("/current", getCurrentClass);

// ====================================
// GET TODAY'S TIMETABLE
// GET /api/timetable/today
// ====================================

router.get("/today", getTodayTimetable);

module.exports = router;