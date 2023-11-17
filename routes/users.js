const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

// Apply the authMiddleware to protect the route
router.use(authMiddleware);

// Route to get the logged-in user data
router.get("/me", getCurrentUser);

// Route to update the user profile
router.patch("/me", updateUserProfile);

module.exports = router;
