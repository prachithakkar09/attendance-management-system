const supabase = require("../config/supabase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ====================================
// ADMIN LOGIN
// POST /api/auth/login
// ====================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find admin by email
    const { data: admin, error } = await supabase
      .from("Admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // TEMPORARY LOGIN
    // Since the password in your database is currently plain text,
    // compare it directly for now.
    if (password !== admin.password) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Create JWT Token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET || "attendance_secret_key",
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
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
  login,
};