const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadStudents } = require("../controllers/uploadController");

// ====================================
// UPLOAD STUDENTS CSV
// POST /api/upload/students
// ====================================
router.post(
  "/students",
  verifyToken,
  upload.single("file"),
  uploadStudents
);

module.exports = router;