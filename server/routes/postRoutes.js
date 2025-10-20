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
      const { 
        content, 
        type, 
        position, 
        company, 
        location, 
        jobType, 
        jobDescription, 
        applicationDeadline, 
        applicationLink,
        // Hughand fields
        title,
        category,
        contactEmail,
        contactPhone,
        address
      } = req.body;

      // Validate required fields
      if (!content || !type) {
        return res
          .status(400)
          .json({ success: false, message: "Content and type are required" });
      }

      const image = req.files?.image ? req.files.image[0].filename : null;
      const doc = req.files?.doc ? req.files.doc[0].filename : null;

      // Prepare post data
      const postData = {
        user: req.user._id,
        content,
        type,
        image,
        doc,
      };

      // Add job details if this is a job post
      if (type === "job") {
        postData.jobDetails = {
          position: position || "",
          company: company || "",
          location: location || "",
          jobType: jobType || "",
          jobDescription: jobDescription || "",
          applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
          applicationLink: applicationLink || "",
        };
      }
      
      // Add hughand details if this is a hughand post
      if (type === "hughand") {
        postData.hughandDetails = {
          title: title || "",
          category: category || "",
          contactEmail: contactEmail || "",
          contactPhone: contactPhone || "",
          address: address || "",
        };
      }

      const newPost = await Post.create(postData);

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

// Debug endpoint to test if changes are loaded
router.get("/debug", (req, res) => {
  res.json({ message: "Debug endpoint - changes are loaded!", timestamp: new Date() });
});

// ============================
// Get All Thoughts (populated with user name) - PUBLIC ACCESS
// ============================
router.get("/all-thoughts", async (req, res) => {
  try {
    console.log("📥 GET /all-thoughts request received");
    
    // fetch all posts where type = 'thought', newest first, and populate user name and profilePic
    const thoughts = await Post.find({ type: "thought" })
      .sort({ createdAt: -1 })
      .populate("user", "name profilePic");

    console.log(`📤 Sending ${thoughts.length} thoughts`);
    res.json({ success: true, thoughts });
  } catch (err) {
    console.error("❌ Error fetching thoughts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch thoughts", error: err.message });
  }
});

// ============================
// Get All Job Posts (populated with user name) - PUBLIC ACCESS
// ============================
router.get("/all-jobs", async (req, res) => {
  try {
    console.log("📥 GET /all-jobs request received");
    
    // fetch all posts where type = 'job', newest first, and populate user name and profilePic
    const jobs = await Post.find({ type: "job" })
      .sort({ createdAt: -1 })
      .populate("user", "name profilePic");

    console.log(`📤 Sending ${jobs.length} job posts`);
    res.json({ success: true, jobs });
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ success: false, message: "Failed to fetch jobs", error: err.message });
  }
});
//FOR MY-POST
// server/routes/postRoutes.js
router.get("/my-posts", protect, async (req, res) => {
  try {
    // req.user.id comes from the 'protect' middleware
    const myPosts = await Post.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // newest first

    res.json({ success: true, posts: myPosts });
  } catch (err) {
    console.error("❌ Error fetching my posts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

// Get posts by user ID
router.get("/user-posts/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await Post.find({ user: userId })
      .sort({ createdAt: -1 }); // newest first

    res.json({ success: true, posts: userPosts });
  } catch (err) {
    console.error("❌ Error fetching user posts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user posts" });
  }
});

// ============================
// Get All Hughand Posts (populated with user name)
// ============================
router.get("/hughand", protect, async (req, res) => {
  try {
    // fetch all posts where type = 'hughand', newest first, and populate user name and profilePic
    const hughandPosts = await Post.find({ type: "hughand" })
      .sort({ createdAt: -1 })
      .populate("user", "name profilePic");

    console.log(`📤 Sending ${hughandPosts.length} hughand posts`);
    res.json({ success: true, posts: hughandPosts });
  } catch (err) {
    console.error("❌ Error fetching hughand posts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch hughand posts" });
  }
});

// ============================
// DELETE a post by ID
// ============================
router.delete("/:id", protect, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post belongs to the logged-in user
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Delete the post
    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error deleting post" });
  }
});

module.exports = router;
