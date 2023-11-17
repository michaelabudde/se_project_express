const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // Adjust the path based on your project structure
const { CREATED } = require("../utils/errors");

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // If the token is not provided or doesn't start with 'Bearer ', return a 401 error
    return res.status(401).send({ message: "Unauthorized" });
  }

  // Extract the token from the Authorization header
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify the token
    const payload = jwt.verify(token, JWT_SECRET);

    // Add the token payload to the user object
    req.user = payload;

    // Call next to move to the next middleware or route handler
    next();
  } catch (error) {
    // If there's an issue with the token (e.g., expired or invalid), return a 401 error
    return res.status(401).send({ message: "Unauthorized" });
  }
  return res.status(CREATED).send({ message: "Everything Worked" });
};

module.exports = authMiddleware;