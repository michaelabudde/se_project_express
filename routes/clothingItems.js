const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

// PUT /items/:itemId/likes — like an item
router.put("/:itemId/likes", likeItem);

// DELETE /items/:itemId/likes — unlike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
