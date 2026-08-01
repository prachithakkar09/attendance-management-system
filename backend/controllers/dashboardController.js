const supabase = require("../config/supabase");

// ====================================
// GET DASHBOARD
// GET /api/dashboard
// ====================================
const getDashboard = async (req, res) => {
  try {
    // Total Students
    const { count: totalStudents, error: studentError } = await supabase
      .from("Students")
      .select("*", { count: "exact", head: true });

    // Total Subjects
    const { count: totalSubjects, error: subjectError } = await supabase
      .from("Subjects")
      .select("*", { count: "exact", head: true });

    // Total Attendance Records
    const { count: totalAttendanceRecords, error: attendanceError } =
      await supabase
        .from("Attendance")
        .select("*", { count: "exact", head: true });

    // Today's Attendance
    const today = new Date().toISOString().split("T")[0];

    const { count: todayAttendance, error: todayError } = await supabase
      .from("Attendance")
      .select("*", { count: "exact", head: true })
      .eq("attendance_date", today);

    // Overall Attendance Percentage
    const { data, error: percentageError } = await supabase
      .from("Attendance")
      .select("status");

    if (
      studentError ||
      subjectError ||
      attendanceError ||
      todayError ||
      percentageError
    ) {
      return res.status(400).json({
        success: false,
        error:
          studentError?.message ||
          subjectError?.message ||
          attendanceError?.message ||
          todayError?.message ||
          percentageError?.message,
      });
    }

    const present = data.filter(
      (row) => row.status?.toLowerCase() === "present"
    ).length;

    const percentage =
      data.length === 0
        ? 0
        : Number(((present / data.length) * 100).toFixed(2));

    return res.status(200).json({
      success: true,
      dashboard: {
        totalStudents,
        totalSubjects,
        totalAttendanceRecords,
        todayAttendance,
        overallAttendancePercentage: percentage,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  getDashboard,
};