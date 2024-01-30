const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// Create
router.post("/", authMiddleware, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", authMiddleware, deleteItem);

// PUT /items/:itemId/likes — like an item
router.put("/:itemId/likes", authMiddleware, likeItem);

// DELETE /items/:itemId/likes — unlike an item
router.delete("/:itemId/likes", authMiddleware, dislikeItem);

module.exports = router;
