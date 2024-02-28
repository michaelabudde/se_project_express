const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateUserProfile } = require("../controllers/user");

// Apply the authMiddleware to protect the route
router.use(authMiddleware);

// Route to get the logged-in user data
router.get("/me", authMiddleware, getCurrentUser);

// Route to update the user profile
router.patch("/me", authMiddleware, updateUserProfile);

module.exports = router;
