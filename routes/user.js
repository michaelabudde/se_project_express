const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateUserProfile } = require("../controllers/user");

// Apply the authMiddleware to protect the route
router.use(authMiddleware);

// Route to get the logged-in user data
router.get("/user/me", authMiddleware, getCurrentUser); // changed from /me ?

// Route to update the user profile
router.patch("/user/me", authMiddleware, updateUserProfile);

module.exports = router;
