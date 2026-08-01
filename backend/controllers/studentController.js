const supabase = require("../config/supabase");

// ====================================
// CREATE STUDENT
// POST /api/students
// ====================================
const addStudent = async (req, res) => {
  try {
    const { enrollment_no, full_name, email, department, semester } = req.body;

    const { data, error } = await supabase
      .from("Students")
      .insert([
        {
          enrollment_no,
          full_name,
          email,
          department,
          semester,
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
      message: "Student added successfully",
      student: data[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET ALL STUDENTS
// GET /api/students
// ====================================
const getStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Students")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      students: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// SEARCH STUDENTS
// GET /api/students/search?query=...
// ====================================
const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const { data, error } = await supabase
      .from("Students")
      .select("*")
      .or(
        `full_name.ilike.%${query}%,enrollment_no.ilike.%${query}%,email.ilike.%${query}%`
      );

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      students: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET STUDENT BY ID
// GET /api/students/:id
// ====================================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("Students")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// UPDATE STUDENT
// PUT /api/students/:id
// ====================================
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { enrollment_no, full_name, email, department, semester } = req.body;

    const { data, error } = await supabase
      .from("Students")
      .update({
        enrollment_no,
        full_name,
        email,
        department,
        semester,
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
      message: "Student updated successfully",
      student: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// DELETE STUDENT
// DELETE /api/students/:id
// ====================================
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("Students")
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
      message: "Student deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  addStudent,
  getStudents,
  searchStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};