const supabase = require("../config/supabase");

// ====================================
// GET CURRENT CLASS
// GET /api/timetable/current
// Optional:
// /api/timetable/current?batch_id=4
// ====================================

const getCurrentClass = async (req, res) => {
  try {
    const now = new Date();

    // Get current day in India
    // Sunday = 0, Monday = 1...
    let day = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
    }).format(now);

    const dayMap = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7,
    };

    day = dayMap[day];

    // Get current time in India
    const currentTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);

    let query = supabase
      .from("Timetable")
      .select(`
        *,
        Subjects (
          id,
          subject_name,
          subject_code,
          "Short Name"
        ),
        Faculty (
          id,
          faculty_name
        ),
        Batches (
          id,
          batch_name
        )
      `)
      .eq("day_of_week", day)
      .lte("start_time", currentTime)
      .gte("end_time", currentTime);

    // Optional batch filter
    if (req.query.batch_id) {
      query = query.eq("batch_id", req.query.batch_id);
    }

    const { data, error } = await query.order("start_time", {
      ascending: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No active class at this time.",
        currentClass: null,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      currentClass: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET TODAY'S TIMETABLE
// GET /api/timetable/today
// Optional:
// /api/timetable/today?batch_id=4
// ====================================

const getTodayTimetable = async (req, res) => {
  try {
    const now = new Date();

    // Get today's day in India
    let day = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
    }).format(now);

    const dayMap = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7,
    };

    day = dayMap[day];

    let query = supabase
      .from("Timetable")
      .select(`
        *,
        Subjects (
          id,
          subject_name,
          subject_code,
          "Short Name"
        ),
        Faculty (
          id,
          faculty_name
        ),
        Batches (
          id,
          batch_name
        )
      `)
      .eq("day_of_week", day)
      .order("start_time", {
        ascending: true,
      });

    // Optional batch filter
    if (req.query.batch_id) {
      query = query.eq("batch_id", req.query.batch_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      day_of_week: day,
      count: data.length,
      timetable: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  getCurrentClass,
  getTodayTimetable,
};