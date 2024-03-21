const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
// 1. The clothing item body when an item is created
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
    weather: Joi.string().valid("hot", "warm", "cold"),
  }),
});
// 2. The user info body when a user is created
module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.base": "Email must be a string",
      "string.empty": 'The "email" field must be filled in',
      "string.email": "Invalid email format",
    }),
    password: Joi.string().required().messages({
      "string.base": "Password must be a string",
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});
// 3. Authentication when a user logs in
module.exports.validateLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.base": "Email must be a string",
      "string.empty": 'The "email" field must be filled in',
      "string.email": "Invalid email format",
    }),
    password: Joi.string().required().messages({
      "string.base": "Password must be a string",
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});
// 4. User and clothing item IDs when they are accessed
module.exports.validateIds = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});
// 5. validate update profile
module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});
