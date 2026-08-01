const express = require("express");
const router = express.Router();

const {
  addSubject,
  getSubjects,
} = require("../controllers/subjectController");

// CREATE
router.post("/", addSubject);

// READ
router.get("/", getSubjects);

module.exports = router;