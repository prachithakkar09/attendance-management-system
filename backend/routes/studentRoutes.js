const express = require("express");
const router = express.Router();

const {
  addStudent,
  getStudents,
  searchStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const { verifyToken } = require("../middleware/authMiddleware");

// CREATE (Protected)
router.post("/", verifyToken, addStudent);

// SEARCH
router.get("/search", searchStudents);

// READ
router.get("/", getStudents);
router.get("/:id", getStudentById);

// UPDATE (Protected)
router.put("/:id", verifyToken, updateStudent);

// DELETE (Protected)
router.delete("/:id", verifyToken, deleteStudent);

module.exports = router;