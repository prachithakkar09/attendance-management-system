require("dotenv").config();

const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ====================================
// ROUTES
// ====================================

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/timetable", timetableRoutes);

// ====================================
// ROOT ROUTE
// ====================================

app.get("/", (req, res) => {
  res.send("Attendance Management System API is Running");
});

// ====================================
// START SERVER
// ====================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});