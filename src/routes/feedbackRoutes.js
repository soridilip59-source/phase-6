const express = require("express");

const {
  createFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create Feedback
router.post("/", protect, createFeedback);

// Get My Feedback
router.get("/my-feedback", protect, getMyFeedback);

// Update Feedback
router.put("/:id", protect, updateFeedback);

// Delete Feedback
router.delete("/:id", protect, deleteFeedback);

module.exports = router;