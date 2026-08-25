const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Token missing
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find student
    req.student = await Student.findById(decoded.id)
      .select("-password");

    if (!req.student) {
      return res.status(401).json({
        message: "Student not found"
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token"
    });
  }
};

module.exports = protect;