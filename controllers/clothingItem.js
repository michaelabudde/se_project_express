const ClothingItem = require("../models/clothingItem");
const BadRequest = require("../errors/bad-request");
const NotFound = require("../errors/not-found");
const Forbidden = require("../errors/not-found");
const {
  // BAD_REQUEST,
  // NOT_FOUND,
  DEFAULT,
  // FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  let errorMessage = null;

  if (!weather) {
    errorMessage = "Weather type is required";
  }

  if (errorMessage) {
    // return res.status(BAD_REQUEST).send({ message: errorMessage });
    next(new BadRequest());
  }

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST).send({ message: err.message });
        next(new BadRequest());
      } else {
        next(err);
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

const deleteItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        // return res.status(NOT_FOUND).send({ message: "Item not found" });
        next(new NotFound());
      }
      if (!item.owner.equals(userId)) {
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "Unauthorized to delete this item" });
        next(new Forbidden());
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "The item deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid request (deleteItem)" });
        next(new BadRequest());
      } else {
        next(err);
      }
      return res.status(DEFAULT).send({ message: "Server error (deleteItem)" });
    });
};

const likeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequest());
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound());
      } else {
        next(err);
      }
      return res.status(DEFAULT).send({ message: "Server error (likeItem)" });
    });
};

const dislikeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid request (dislikeItem)" });
        next(new BadRequest());
      }
      if (err.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND)
        //   .send({ message: "Requested info is not found (dislikeItem)" });
        next(new NotFound());
      } else {
        next(err);
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
