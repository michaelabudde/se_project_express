const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const { validateCardBody, validateIds } = require("../middlewares/validation");

// Create
router.post("/", authMiddleware, validateCardBody, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", authMiddleware, validateIds, deleteItem);

// PUT /items/:itemId/likes — like an item
router.put("/:itemId/likes", authMiddleware, validateIds, likeItem);

// DELETE /items/:itemId/likes — unlike an item
router.delete("/:itemId/likes", authMiddleware, validateIds, dislikeItem);

module.exports = router;
