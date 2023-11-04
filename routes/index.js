const router = require("express").Router();

const clothingItem = require("./clothingItems");
const users = require("./users");

router.use("/items", clothingItem);
router.use("/users", users);

router.get("/", (req, res) => {
  console.log(req, "hello");
  res.status(200).send({ message: "I WORK" });
});
router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});
module.exports = router;
