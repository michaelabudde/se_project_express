const user = require("../models/user");

// GET /users — returns all users
const getUsers = (req, res) => {
  user.find({});
};

// GET /users/:userId - returns a user by _id
const getUserId = (req, res) => {
  user.findById(user, {});
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
