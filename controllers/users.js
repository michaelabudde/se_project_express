const user = require("../models/user");

// GET /users — returns all users
const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      res.status(500).send({ message: "Error from getUsers", e });
    });
};

// GET /users/:userId - returns a user by _id
const getUserId = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail(() => {})
    .then(() => res.status(200).send({ data: userId }))
    .catch((e) => {
      res.status(500).send({ message: "Error from getUserId", e });
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
    .catch((e) => {
      res.status(500).send({ message: "error from createItem", e });
    });
};

module.exports = { getUsers, getUserId, createUser };
