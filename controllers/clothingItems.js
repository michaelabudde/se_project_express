const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
  // errorHandler,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);
  const { name, weather, imageUrl, likes } = req.body;
  ClothingItem.create({ name, weather, imageUrl, likes, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createItem)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (createItem)" });
    });
};

const getItems = (req, res) => {
  console.log("getLikes");
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  console.log(itemId, imageUrl);
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    // why is this saying not used?
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "The item is owned by other user" });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "The item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (deleteItem)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (deleteItem)" });
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
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
