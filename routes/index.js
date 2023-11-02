const router = require("express").Router();

const clothingItem = require("./clothingItems");

router.use("/items", clothingItem);
router.get("/", (req, res) => {
  console.log(req, "hello");
  res.status(200).send({ message: "I WORK" });
});
router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});
module.exports = router;
