const express = require("express");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get User Profile
router.get("/profile", protect, getUserProfile);

// Update User Profile
router.put("/profile", protect, updateUserProfile);

module.exports = router;