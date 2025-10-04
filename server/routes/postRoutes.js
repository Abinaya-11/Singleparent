const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../models/Post");
const { authMiddleware } = require("../middleware/authMiddleware");

// Storage setup for images/files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});
const upload = multer({ storage });

// 🔹 Create a post
router.post("/", authMiddleware, upload.fields([{ name: "image" }, { name: "doc" }]), async (req, res) => {
  try {
    const { content, type } = req.body;
    const image = req.files?.image ? req.files.image[0].path : null;
    const doc = req.files?.doc ? req.files.doc[0].path : null;

    const newPost = await Post.create({
      user: req.user._id,
      content,
      image,
      doc,
      type,
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});

// 🔹 Fetch all posts for a user
router.get("/my-posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

module.exports = router;
