const Feedback = require("../models/Feedback");

// ==========================
// CREATE FEEDBACK
// ==========================
const createFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required"
      });
    }

    const feedback = await Feedback.create({
      student: req.student._id,
      rating,
      comment
    });

    return res.status(201).json({
      message: "Feedback created successfully",
      feedback
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// ==========================
// GET MY FEEDBACK
// ==========================
const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      student: req.student._id
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: feedbacks.length,
      feedbacks
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// ==========================
// UPDATE FEEDBACK
// ==========================
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    // Check feedback ownership
    if (feedback.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this feedback"
      });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined) {
      feedback.rating = rating;
    }

    if (comment !== undefined) {
      feedback.comment = comment;
    }

    await feedback.save();

    return res.status(200).json({
      message: "Feedback updated successfully",
      feedback
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// ==========================
// DELETE FEEDBACK
// ==========================
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    // Check feedback ownership
    if (feedback.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this feedback"
      });
    }

    await feedback.deleteOne();

    return res.status(200).json({
      message: "Feedback deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback
};