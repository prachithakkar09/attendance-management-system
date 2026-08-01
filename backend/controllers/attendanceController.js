const supabase = require("../config/supabase");

// ====================================
// MARK ATTENDANCE
// ====================================
const markAttendance = async (req, res) => {
  try {
    const { student_id, subject_id, attendance_date, status } = req.body;

    const { data, error } = await supabase
      .from("Attendance")
      .insert([
        {
          student_id,
          subject_id,
          attendance_date,
          status,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: data[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET ALL ATTENDANCE
// ====================================
const getAttendance = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        *,
        Students(id, full_name, enrollment_no),
        Subjects(id, subject_name, subject_code)
      `)
      .order("attendance_date", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      attendance: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET ATTENDANCE BY ID
// ====================================
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        *,
        Students(id, full_name, enrollment_no),
        Subjects(id, subject_name, subject_code)
      `)
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      attendance: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET ATTENDANCE BY STUDENT
// ====================================
const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        *,
        Students(id, full_name, enrollment_no),
        Subjects(id, subject_name, subject_code)
      `)
      .eq("student_id", studentId)
      .order("attendance_date", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      attendance: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET ATTENDANCE PERCENTAGE
// ====================================
const getAttendancePercentage = async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from("Attendance")
      .select("status")
      .eq("student_id", studentId);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    const totalClasses = data.length;
    const present = data.filter(
      (row) => row.status.toLowerCase() === "present"
    ).length;
    const absent = data.filter(
      (row) => row.status.toLowerCase() === "absent"
    ).length;

    const percentage =
      totalClasses === 0
        ? 0
        : Number(((present / totalClasses) * 100).toFixed(2));

    return res.status(200).json({
      success: true,
      summary: {
        totalClasses,
        present,
        absent,
        percentage,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// UPDATE ATTENDANCE
// ====================================
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, subject_id, attendance_date, status } = req.body;

    const { data, error } = await supabase
      .from("Attendance")
      .update({
        student_id,
        subject_id,
        attendance_date,
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// DELETE ATTENDANCE
// ====================================
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("Attendance")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getAttendanceById,
  getAttendanceByStudent,
  getAttendancePercentage,
  updateAttendance,
  deleteAttendance,
};