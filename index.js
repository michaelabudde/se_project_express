const router = require("express").Router();
const { NOT_FOUND } = require("./utils/errors");

const clothingItem = require("./routes/clothingItems");
const users = require("./routes/users");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Requested resource not found",
  });
});
module.exports = router;
