const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// =============================
// @route   POST /api/auth/register
// @desc    Register new user (auto role detect)
// =============================
router.post("/register", async (req, res) => {
  const { name, email, password, interests } = req.body;

  try {
    console.log("Register request received:", req.body);

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    // ✅ Automatically determine role based on email
    // You can add multiple admin emails if needed
    const adminEmails = ["admin@caregroove.com", "manager@caregroove.com"];
    const isAdmin = adminEmails.includes(email.toLowerCase());
    const role = isAdmin ? "admin" : "user";

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Parse interests if provided
    let parsedInterests = [];
    if (interests) {
      try {
        parsedInterests = JSON.parse(interests);
      } catch {
        parsedInterests = [];
      }
    }

    // create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      interests: parsedInterests,
      role, // automatically set role
    });

    await newUser.save();

    // generate token including role
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        interests: newUser.interests,
      },
      msg: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).send("Server error");
  }
});

// =============================
// @route   POST /api/auth/login
// @desc    Authenticate user & get token (auto role check)
// =============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login request received:", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    // ✅ Automatically recheck role on login (in case admin added later)
    const adminEmails = ["admin@caregroove.com", "manager@caregroove.com"];
    const isAdmin = adminEmails.includes(user.email.toLowerCase());
    if (user.role !== (isAdmin ? "admin" : "user")) {
      user.role = isAdmin ? "admin" : "user";
      await user.save();
    }

    // generate token including role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        interests: user.interests || [],
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Server error");
  }
});

// =============================
// @route   POST /api/auth/google-login
// @desc    Authenticate user with Google OAuth
// =============================
router.post("/google-login", async (req, res) => {
  const { googleId, email, name, picture } = req.body;

  try {
    console.log("Google login request received:", { googleId, email, name });

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists - update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePic = picture;
        await user.save();
      }
    } else {
      // Create new user with Google info
      const adminEmails = ["admin@caregroove.com", "manager@caregroove.com"];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      const role = isAdmin ? "admin" : "user";
      
      user = new User({
        name,
        email,
        googleId,
        profilePic: picture,
        role,
        password: 'google-oauth', // placeholder since Google users don't need password
        interests: []
      });
      
      await user.save();
      console.log('New Google user created:', user._id);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Longer expiry for Google login
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePic: user.profilePic,
        interests: user.interests || [],
      },
    });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(500).json({ success: false, message: "Server error during Google login" });
  }
});

module.exports = router;
