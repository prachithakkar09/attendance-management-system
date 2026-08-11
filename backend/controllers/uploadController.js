const fs = require("fs");
const csv = require("csv-parser");
const supabase = require("../config/supabase");

// ====================================
// UPLOAD STUDENTS CSV
// POST /api/students/upload
// ====================================
const uploadStudents = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a CSV file.",
      });
    }

    const students = [];

    // Read CSV
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        students.push({
          enrollment_no: row.enrollment_no,
          full_name: row.full_name,
          email: row.email,
          department: row.department,
          semester: Number(row.semester),
        });
      })
      .on("end", async () => {
        try {
          // Remove duplicate enrollment numbers inside the CSV
          const uniqueStudents = [];
          const seen = new Set();

          for (const student of students) {
            if (!seen.has(student.enrollment_no)) {
              seen.add(student.enrollment_no);
              uniqueStudents.push(student);
            }
          }

          // Bulk Insert
          const { data, error } = await supabase
            .from("Students")
            .insert(uniqueStudents)
            .select();

          // Delete uploaded file
          fs.unlinkSync(req.file.path);

          if (error) {
            return res.status(400).json({
              success: false,
              error: error.message,
            });
          }

          return res.status(201).json({
            success: true,
            message: "CSV imported successfully",
            summary: {
              totalRows: students.length,
              inserted: data.length,
              duplicates: students.length - uniqueStudents.length,
            },
            students: data,
          });
        } catch (err) {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  uploadStudents,
};