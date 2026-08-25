const express = require("express");

const {
  createFeedback,
  getAllFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL FEEDBACK
router.get("/", getAllFeedback);


// CREATE FEEDBACK
router.post("/", protect, createFeedback);


// GET MY FEEDBACK
router.get("/my-feedback", protect, getMyFeedback);


// UPDATE FEEDBACK
router.put("/:id", protect, updateFeedback);


// DELETE FEEDBACK
router.delete("/:id", protect, deleteFeedback);


module.exports = router;