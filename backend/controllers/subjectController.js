const supabase = require("../config/supabase");

// ====================================
// CREATE SUBJECT
// POST /api/subjects
// ====================================
const addSubject = async (req, res) => {
  try {
    const { subject_name, subject_code, semester, department } = req.body;

    const { data, error } = await supabase
      .from("Subjects")
      .insert([
        {
          subject_name,
          subject_code,
          semester,
          department,
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
      message: "Subject added successfully",
      subject: data[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ====================================
// GET ALL SUBJECTS
// GET /api/subjects
// ====================================
const getSubjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Subjects")
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
      subjects: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  addSubject,
  getSubjects,
};