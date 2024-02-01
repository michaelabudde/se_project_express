const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

const itemRouter = require("./clothingItem");
const userRouter = require("./user");

router.use("/items", itemRouter);
router.use("/me", userRouter); // user or me?
router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Requested resource not found",
  });
});
module.exports = router;
