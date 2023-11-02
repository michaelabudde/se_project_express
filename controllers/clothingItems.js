const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};
// was this implemented correctly?
// can i just delete extra res?

// module.exports.createClothingItem = (req) => {
//   console.log(req.user._id); // _id will become accessible
// };

const getItems = (req, res) => {
  console.log("getLikes");
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
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
      res.status(500).send({ message: "Error from updateItems", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    // why is this saying not used?
    .then(() => res.status(204).send({}))
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItems", e });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  );
};

module.exports.dislikeItem = (req) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  );

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
};
