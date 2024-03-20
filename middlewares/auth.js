const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// const { UNAUTHORIZED } = require("../utils/errors");
const Unauthorized = require("../errors/unauthorized");

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // If the token is not provided or doesn't start with 'Bearer ', return a 401 error
    // return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
    next(new Unauthorized("Incorrect email or password"));
  }

  // Extract the token from the Authorization header
  const token = authorization.replace("Bearer ", "");

  // Verify the token
  const payload = jwt.verify(token, JWT_SECRET);

  if (!payload) {
    // If there's an issue with the token (e.g., expired or invalid), return a 401 error
    // return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
    next(new Unauthorized("Incorrect email or password"));
  }

  // Add the token payload to the user object
  req.user = payload;

  return next(); // Call next to move to the next middleware or route handler
};

module.exports = authMiddleware;
