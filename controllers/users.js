const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // Adjust the path based on your project structure

const user = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
  CREATED,
} = require("../utils/errors");

// GET /users — returns all users
const getUsers = (req, res) => {
  user
    .find()
    .then((users) => {
      res.send({ data: users }); // Always return 200 status for a list of users
    })
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: "Server error (getUsers)" });
    });
};

// GET /users/:userId - returns a user by _id
const getUserId = (req, res) => {
  const { userId } = req.params; // Use req.user._id to retrieve the user's ID

  user
    .findById(userId)
    .orFail()

    .then((userData) => {
      res.status(200).send({ data: userData });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Not a valid Id" });
      }
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" }); // Change the status to 404 if the user is not found
      }
      return res.status(DEFAULT).send({ message: "Server error (getUserId)" });
    });
};

// POST /users — creates a new user
const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;
    if (!email || !password) {
      return res.status(BAD_REQUEST).send({ message: "bad request" });
    }
    // Check if a user with the same email already exists
    const existingUser = await user.findOne({ email }).select("+password");

    if (existingUser) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password

    await user.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const responseUser = {
      name,
      avatar,
      email,
    };

    return res.status(CREATED).send({ data: responseUser });
  } catch (err) {
    console.error(err);

    // Handle other validation errors
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid request (createUser)" });
    }
    return res.status(DEFAULT).send({ message: "Server error (createUser)" });
  }
  // Handle other errors
};

const login = (req, res) =>
  user
    .findUserByCredentials(req, res)
    .then(() => {
      // Authentication successful! Create a JWT
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send the token to the client in the response body
      res.status(200).send({ token });
    })
    .catch((err) => {
      // Authentication error
      res.status(401).send({ message: err.message });
    });
const getCurrentUser = async (req, res) => {
  try {
    // The user data is available in req.user due to the authMiddleware
    const userId = req.user._id;

    // Fetch user data based on the _id value

    if (!userId) {
      return res.status(404).send({ message: "User not found" });
    }

    // Return the user data
    res.status(200).send({ data: userId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error (getCurrentUser)" });
  }
  return res.status(CREATED).send({ message: "Everything Worked" });
};
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Update the user profile
    const updateUser = await user.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Run model validation on the updated data
    });

    if (!updateUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // Return the updated user data
    res.status(200).send({ data: user });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Validation error (updateUserProfile)" });
    }

    // Handle server errors
    res.status(500).send({ message: "Server error (updateUserProfile)" });
  }
  return res.status(CREATED).send({ message: "Everything Worked" });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
