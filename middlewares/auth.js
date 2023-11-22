const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // Adjust the path based on your project structure
const { UNAUTHORIZED } = require("../utils/errors");

const authMiddleware = async (req, res, next) => {
  // Get the token from the Authorization header
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // If the token is not provided or doesn't start with 'Bearer ', return a 401 error
    return res.status(UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  // Extract the token from the Authorization header
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify the token
    const payload = await jwt.verify(token, JWT_SECRET);

    // Add the token payload to the user object
    req.user = payload;

    return next();
  } catch (error) {
    // If there's an issue with the token (e.g., expired or invalid), return a 401 error
    return res
      .status(UNAUTHORIZED)
      .json({ error: "Unauthorized", message: error.message });
  }
};

module.exports = authMiddleware;
