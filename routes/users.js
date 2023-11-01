const router = require("express").Router();
const { getUsers, getUserId, createUser } = require("../controllers/users");
// CRUD

// GetUser
// GET /users — returns all users
router.post("/", getUsers);

// UserId
// GET /users/:userId - returns a user by _id
router.post("/", getUserId);

// CreateUser
// POST /users — creates a new user
router.post("/", createUser);

module.exports = router;
