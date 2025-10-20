const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Connection = require("../models/Connection");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// =============================
// Middleware to verify JWT token
// =============================
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, msg: "No token, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, msg: "Token is not valid" });
  }
};

// =============================
// Multer setup for file uploads
// =============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, req.userId + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET /api/user/all
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.userId;
    
    // Get all users except current user
    const users = await User.find(
      { _id: { $ne: currentUserId } }, 
      { password: 0 }
    );
    
    // Get user's connections and pending requests
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ]
    });
    
    // Create sets of connected/requested user IDs for efficient filtering
    const connectedUserIds = new Set();
    const requestedUserIds = new Set();
    
    connections.forEach(conn => {
      const otherUserId = conn.requester.toString() === currentUserId 
        ? conn.recipient.toString() 
        : conn.requester.toString();
      
      if (conn.status === "accepted") {
        connectedUserIds.add(otherUserId);
      } else if (conn.status === "pending") {
        requestedUserIds.add(otherUserId);
      }
    });
    
    // Add metadata to users about their connection status
    const usersWithStatus = users.map(user => {
      const userId = user._id.toString();
      return {
        ...user.toObject(),
        isConnected: connectedUserIds.has(userId),
        isRequested: requestedUserIds.has(userId),
        canConnect: !connectedUserIds.has(userId) && !requestedUserIds.has(userId)
      };
    });
    
    res.json({ success: true, users: usersWithStatus });
  } catch (err) {
    console.error("Fetch all users error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// =============================
// GET /api/user/profile
// =============================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.userId).select("-password").lean();
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    // ✅ Always return an array for interests
    if (typeof user.interests === "string") {
      try {
        const parsed = JSON.parse(user.interests);
        user.interests = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
      } catch {
        user.interests = user.interests ? [user.interests] : [];
      }
    } else if (!Array.isArray(user.interests)) {
      user.interests = [];
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// =============================
// GET /api/user/profile/:userId - Get any user's profile by ID
// =============================
router.get("/profile/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    let user = await User.findById(userId).select("-password").lean();
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    // ✅ Always return an array for interests
    if (typeof user.interests === "string") {
      try {
        const parsed = JSON.parse(user.interests);
        user.interests = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
      } catch {
        user.interests = user.interests ? [user.interests] : [];
      }
    } else if (!Array.isArray(user.interests)) {
      user.interests = [];
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("User profile fetch error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// =============================
// PUT /api/user/profile
// =============================
router.put("/profile", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const { location, bio } = req.body;

    // ✅ Parse interests properly
    let interests = [];
    if (req.body.interests) {
      if (Array.isArray(req.body.interests)) {
        interests = req.body.interests;
      } else if (typeof req.body.interests === "string") {
        try {
          const parsed = JSON.parse(req.body.interests);
          interests = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
        } catch {
          // fallback: handle comma-separated string
          interests = req.body.interests.split(",").map(s => s.trim()).filter(Boolean);
        }
      }
    }

    // ✅ Handle uploaded profile picture
    const profilePic = req.file ? req.file.filename : undefined;

    const updatedData = { location, bio, interests };
    if (profilePic) updatedData.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
