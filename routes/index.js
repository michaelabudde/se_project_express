const router = require("express").Router();
const NotFound = require("../errors/not-found");

const itemRouter = require("./clothingItem");
const userRouter = require("./user");
const {
  validateUserInfo,
  validateLogIn,
} = require("../middlewares/validation");
const { login, createUser } = require("../controllers/user");

router.post("/signin", validateLogIn, login);
router.post("/signup", validateUserInfo, createUser);
router.use("/items", itemRouter);
router.use("/users", userRouter);
// router.use((req, res) => {
//   res.status(NOT_FOUND).send({
//     message: "Requested resource not found",
//   });
// });
router.use((next) => {
  next(new NotFound("not found"));
});
module.exports = router;
