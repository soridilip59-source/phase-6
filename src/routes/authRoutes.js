const express = require("express");

const {
  registerStudent,
  loginStudent
} = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/register", registerStudent);

// Login
router.post("/login", loginStudent);

module.exports = router;