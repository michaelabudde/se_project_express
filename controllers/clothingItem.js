const ClothingItem = require("../models/clothingItem");
const BadRequest = require("../errors/bad-request");
const NotFound = require("../errors/not-found");
const Forbidden = require("../errors/forbidden");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  let errorMessage = null;

  if (!weather) {
    errorMessage = "Weather type is required";
  }

  if (errorMessage) {
    // return res.status(BAD_REQUEST).send({ message: errorMessage });
    next(new BadRequest("bad request"));
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
        next(new BadRequest("bad request"));
      } else {
        next(err);
      }
    });
};

// const getItems = (req, res) => {
//   if (ClothingItem.find({})){
//     .then((items) => res.send({ items }))
//     .catch(() => {});} else {
//       next(err);
//     }
// };
// const getItems = (req, res, next) => {
//   ClothingItem.find({})
//     .then((items) => {
//       if (items) {
//         res.send({ items });
//       } else {
//         throw err;
//       }
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    res.send({ items });
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};

const deleteItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        // return res.status(NOT_FOUND).send({ message: "Item not found" });
        return next(new NotFound("not found"));
      }
      if (!item.owner.equals(userId)) {
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "Unauthorized to delete this item" });
        return next(new Forbidden("forbidden"));
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
        next(new BadRequest("bad request"));
      } else {
        next(err);
      }
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
        next(new BadRequest("bad request"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("not found"));
      } else {
        next(err);
      }
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
        next(new BadRequest("bad request"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND)
        //   .send({ message: "Requested info is not found (dislikeItem)" });
        next(new NotFound("not found"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
