const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
  // errorHandler,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.user);
  const { name, weather, imageUrl } = req.body; // removed likes
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  }) // removed likes
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: "Server error (createItem)" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ items }))
    .catch(() => {
      res.status(DEFAULT).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  console.log(req.user);
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      if (!item.owner.equals(userId)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Unauthorized to delete this item" });
      }

      return item
        .deleteOne()
        .then(() => res.send({ message: "The item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (deleteItem)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (deleteItem)" });
    });
};

const likeItem = (req, res) => {
  const userId = req.user._id;
  console.log("itemId:", req.params.itemId);
  console.log("userId:", userId);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (likeItem)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (likeItem)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (likeItem)" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (dislikeItem)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (dislikeItem)" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (dislikeItem)" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
