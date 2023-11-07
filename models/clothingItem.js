const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    // weather — a required string that describes the weather type. Make sure it matches the weather type you defined in your React app ('hot', 'warm', and'cold'). Use the enum validator to implement the field.
    weather: {
      type: String,
      required: true,
      enum: ["hot", "warm", "cold"],
    },
    // imageUrl — the picture of the clothing item, a required string for the image URL
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return validator.isURL(value);
        },
        message: "You must enter a valid URL",
      },
    },
    // owner — a link to the item author's model of the ObjectId type, a required field
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: "URL cannot be empty",
    },
    // likes — a list of users who liked the item, an ObjectId array with a reference to the user modal (empty by default)
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
    // createdAt — the item creation date, a field with the Date type and the default value Date.now
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("clothingItem", clothingItem);
