const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/users");

// Apply the authMiddleware to protect the route
router.use(authMiddleware);

// Route to get the logged-in user data
router.get("/me", getCurrentUser);

module.exports = router;
