const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // Adjust the path based on your project structure

const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  DEFAULT,
  CONFLICT,
  CREATED,
  SUCCESS,
} = require("../utils/errors");

// POST /users — creates a new user
const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;
    if (!email || !password) {
      return res.status(BAD_REQUEST).send({ message: "bad request" });
    }
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email }).select("+password");

    if (existingUser) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password

    await User.create({
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

const login = (req, res) => {
  console.log(req.body);
  const { body } = req;
  User.findUserByCredentials(body.email, body.password)
    .then((user) => {
      // Authentication successful! Create a JWT
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send the token to the client in the response body
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: "unauthorized login" });
      }
      // Authentication error
      return res.status(DEFAULT).send({ message: "authentification error" });
    });
};

const getCurrentUser = async (req, res) => {
  try {
    // The user data is available in req.user due to the authMiddleware
    const userId = req.user._id;
    // Fetch user data based on the _id value
    const user = await User.findById(userId);

    if (!userId) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    // Return the user data
    return res.status(SUCCESS).send({ data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(DEFAULT)
      .send({ message: "Server error (getCurrentUser)" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, avatar } = req.body; // Destructure only the name and avatar fields

    // Create an object with only the specified fields to update
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    // Update the user profile
    const updateUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Run model validation on the updated data
    });

    if (!updateUser) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    // Return the updated user data
    return res.status(SUCCESS).send({ data: updateUser });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Validation error (updateUserProfile)" });
    }

    // Handle server errors
    return res
      .status(DEFAULT)
      .send({ message: "Server error (updateUserProfile)" });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
