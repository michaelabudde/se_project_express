const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  // dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

// PUT /items/:itemId/likes — like an item
router.put("/items/:itemId/likes", likeItem);

// DELETE /items/:itemId/likes — unlike an item
// router.delete("/items/:itemId/likes", dislikeItem);

module.exports = router;
