const jwt = require("jsonwebtoken");
const User = require("../models/user"); // make sure you have a User model

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  let token;

  try {
    // Token usually comes in headers: "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // take the second part

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to req (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // move to next middleware/controller
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { authMiddleware };
