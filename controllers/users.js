const user = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

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
const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { name, avatar } = req.body;
  user
    .create({ name, avatar })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createUser)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (createUser)" });
    });
};

module.exports = { getUsers, getUserId, createUser };
