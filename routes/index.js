const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

const itemRouter = require("./clothingItem");
const userRouter = require("./user");
const {
  validateUserInfo,
  validateLogIn,
} = require("../middlewares/validation");
const { login, createUser } = require("../controllers/user");

router.post("/login", validateLogIn, login);
router.post("/signup", validateUserInfo, createUser);
router.use("/items", itemRouter);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Requested resource not found",
  });
});
module.exports = router;
