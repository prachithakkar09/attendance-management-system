const supabase = require("../config/supabase");

// ====================================
// MARK ATTENDANCE
// POST /api/attendance
// ====================================

const markAttendance = async (req, res) => {
  try {
    const {
      student_id,
      timetable_id,
      attendance_date,
      status,
    } = req.body;

    // ====================================
    // VALIDATE REQUIRED FIELDS
    // ====================================

    if (
      !student_id ||
      !timetable_id ||
      !attendance_date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        error:
          "student_id, timetable_id, attendance_date and status are required",
      });
    }

    // ====================================
    // GET STUDENT
    // ====================================

    const { data: student, error: studentError } = await supabase
      .from("Students")
      .select(`
        id,
        full_name,
        enrollment_no,
        batch_id,
        Batches (
          id,
          batch_name
        )
      `)
      .eq("id", student_id)
      .single();

    if (studentError || !student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // ====================================
    // GET TIMETABLE
    // ====================================

    const { data: timetable, error: timetableError } = await supabase
      .from("Timetable")
      .select(`
        id,
        day_of_week,
        start_time,
        end_time,
        lecture_title,
        "Lecture/Lab number",
        "Room/Lab number",
        is_lab,
        subject_id,
        faculty_id,
        batch_id,
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
      .eq("id", timetable_id)
      .single();

    if (timetableError || !timetable) {
      return res.status(404).json({
        success: false,
        error: "Timetable record not found",
      });
    }

    // ====================================
    // BATCH VALIDATION
    // ====================================
    // For lab classes, the student's batch
    // must match the timetable batch.
    //
    // Theory classes have batch_id = null,
    // so this check is skipped for theory.
    // ====================================

    if (
      timetable.is_lab === true &&
      timetable.batch_id !== student.batch_id
    ) {
      return res.status(400).json({
        success: false,
        error: "Student does not belong to this timetable batch",
        student_batch: student.Batches,
        timetable_batch: timetable.Batches,
      });
    }

    // ====================================
    // DUPLICATE ATTENDANCE CHECK
    // ====================================

    const {
      data: existingAttendance,
      error: duplicateError,
    } = await supabase
      .from("Attendance")
      .select("id, status")
      .eq("student_id", student_id)
      .eq("timetable_id", timetable_id)
      .eq("attendance_date", attendance_date)
      .maybeSingle();

    if (duplicateError) {
      return res.status(400).json({
        success: false,
        error: duplicateError.message,
      });
    }

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        error:
          "Attendance already marked for this student and class",
        attendance: existingAttendance,
      });
    }

    // ====================================
    // INSERT ATTENDANCE
    // ====================================

    const { data, error } = await supabase
      .from("Attendance")
      .insert([
        {
          student_id,
          timetable_id,
          attendance_date,
          status,
        },
      ])
      .select(`
        *,
        Students (
          id,
          full_name,
          enrollment_no
        ),
        Timetable (
          id,
          day_of_week,
          start_time,
          end_time,
          lecture_title,
          "Lecture/Lab number",
          "Room/Lab number",
          is_lab,
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
        )
      `)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
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
// GET ALL ATTENDANCE
// GET /api/attendance
// ====================================

const getAttendance = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        *,
        Students (
          id,
          full_name,
          enrollment_no
        ),
        Timetable (
          id,
          day_of_week,
          start_time,
          end_time,
          lecture_title,
          "Lecture/Lab number",
          "Room/Lab number",
          is_lab,
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
        )
      `)
      .order("attendance_date", {
        ascending: false,
      });

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
// GET /api/attendance/:id
// ====================================

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        *,
        Students (
          id,
          full_name,
          enrollment_no
        ),
        Timetable (
          id,
          day_of_week,
          start_time,
          end_time,
          lecture_title,
          "Lecture/Lab number",
          "Room/Lab number",
          is_lab,
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
        )
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
// GET /api/attendance/student/:studentId
// ====================================

const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        *,
        Students (
          id,
          full_name,
          enrollment_no
        ),
        Timetable (
          id,
          day_of_week,
          start_time,
          end_time,
          lecture_title,
          "Lecture/Lab number",
          "Room/Lab number",
          is_lab,
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
        )
      `)
      .eq("student_id", studentId)
      .order("attendance_date", {
        ascending: false,
      });

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
// GET ATTENDANCE BY TIMETABLE
// GET /api/attendance/timetable/:timetableId
// ====================================

const getAttendanceByTimetable = async (req, res) => {
  try {
    const { timetableId } = req.params;

    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        *,
        Students (
          id,
          full_name,
          enrollment_no,
          department,
          semester,
          batch_id
        ),
        Timetable (
          id,
          day_of_week,
          start_time,
          end_time,
          lecture_title,
          "Lecture/Lab number",
          "Room/Lab number",
          is_lab,
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
        )
      `)
      .eq("timetable_id", timetableId)
      .order("student_id", {
        ascending: true,
      });

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
// GET /api/attendance/percentage/:studentId
// ====================================

const getAttendancePercentage = async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from("Attendance")
      .select(`
        status,
        Timetable (
          subject_id
        )
      `)
      .eq("student_id", studentId);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    const totalClasses = data.length;

    const present = data.filter(
      (row) =>
        row.status &&
        row.status.toLowerCase() === "present"
    ).length;

    const absent = data.filter(
      (row) =>
        row.status &&
        row.status.toLowerCase() === "absent"
    ).length;

    const percentage =
      totalClasses === 0
        ? 0
        : Number(
            ((present / totalClasses) * 100).toFixed(2)
          );

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
// PUT /api/attendance/:id
// ====================================

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      student_id,
      timetable_id,
      attendance_date,
      status,
    } = req.body;

    const { data, error } = await supabase
      .from("Attendance")
      .update({
        student_id,
        timetable_id,
        attendance_date,
        status,
      })
      .eq("id", id)
      .select(`
        *,
        Students (
          id,
          full_name,
          enrollment_no
        ),
        Timetable (
          id,
          lecture_title,
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
        )
      `)
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
// DELETE /api/attendance/:id
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

// ====================================
// EXPORT
// ====================================

module.exports = {
  markAttendance,
  getAttendance,
  getAttendanceById,
  getAttendanceByStudent,
  getAttendanceByTimetable,
  getAttendancePercentage,
  updateAttendance,
  deleteAttendance,
};