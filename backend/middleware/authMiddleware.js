const jwt = require("jsonwebtoken");

// ====================================
// VERIFY JWT TOKEN
// ====================================
const verifyToken = (req, res, next) => {
    console.log(req.headers);
  try {
    // Get Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    // Expected format:
    // Authorization: Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Invalid token format.",
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "attendance_secret_key"
    );

    // Store logged-in user info
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};

module.exports = {
  verifyToken,
};