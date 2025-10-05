// server/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const { protect } = require("../middleware/authMiddleware");

// ============================
// Ensure uploads folder exists
// ============================
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Created uploads directory");
}

// ============================
// Multer setup for file upload
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});

const upload = multer({ storage });

// ============================
// Create a New Post
// ============================
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "doc", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("📥 Incoming POST /api/posts");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    try {
      const { content, type } = req.body;

      // Validate required fields
      if (!content || !type) {
        return res
          .status(400)
          .json({ success: false, message: "Content and type are required" });
      }

      const image = req.files?.image ? req.files.image[0].path.replace(/\\/g, "/") : null;
      const doc = req.files?.doc ? req.files.doc[0].path.replace(/\\/g, "/") : null;

      const newPost = await Post.create({
        user: req.user._id,
        content,
        type,
        image,
        doc,
      });

      console.log("✅ New post saved:", newPost._id);

      res.status(201).json({ success: true, post: newPost });
    } catch (err) {
      console.error("❌ Error creating post:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to create post", error: err.message });
    }
  }
);

// ============================
// Get All Posts of Logged-in User
// ============================
router.get("/my-posts", protect, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log(`📤 Sending ${posts.length} posts for user ${req.user._id}`);
    res.json({ success: true, posts });
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

// ✅ DELETE a post by ID
router.delete("/:id", protect, async (req, res) => {
  
  try {
    const postId = req.params.id;

    // find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check if the post belongs to the logged-in user
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // delete the post
    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error deleting post" });
  }
});


module.exports = router;
