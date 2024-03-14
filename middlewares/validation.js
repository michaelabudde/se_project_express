const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
// 1. The clothing item body when an item is created

// The item name is a required string of between 2 and 30 characters.
// An image URL is a required string in a URL format.

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});
// 2. The user info body when a user is created

// The user name is a string of between 2 and 30 characters.
// The user avatar is a required string in a URL format.
// Email is a required string in a valid email format.
// Password is a required string.
module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.base": "Email must be a string",
      "string.empty": 'The "email" field must be filled in',
      "string.email": "Invalid email format",
    }),
    password: Joi.string().required().password().messages({
      "string.base": "Password must be a string",
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});
// 3. Authentication when a user logs in

// Email is a required string in a valid email format.
// Password is a required string.
module.exports.validateLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.base": "Email must be a string",
      "string.empty": 'The "email" field must be filled in',
      "string.email": "Invalid email format",
    }),
    password: Joi.string().required().password().messages({
      "string.base": "Password must be a string",
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});
// 4. User and clothing item IDs when they are accessed

// IDs must be a hexadecimal value length of 24 characters.
module.exports.validateIDs = celebrate({
  params: Joi.object().keys({
    userID: Joi.string().hex().length(24).required().messages({
      "string.hex": "User ID must be a hexadecimal value",
      "string.length": "User ID must be 24 characters long",
      "any.required": "User ID is required",
    }),
    itemID: Joi.string().hex().length(24).required().messages({
      "string.hex": "Item ID must be a hexadecimal value",
      "string.length": "Item ID must be 24 characters long",
      "any.required": "Item ID is required",
    }),
  }),
});
