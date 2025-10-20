const express = require("express");
const router = express.Router();
const ItemRequest = require("../models/ItemRequest");
const Notification = require("../models/Notification");
const Post = require("../models/post");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

// ============================
// Create Item Request
// ============================
router.post("/", protect, async (req, res) => {
  try {
    const { postId, message, email, phone } = req.body;
    const requesterId = req.user._id;

    // Find the post
    const post = await Post.findById(postId).populate("user", "name");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if requester is not the post owner
    if (post.user._id.toString() === requesterId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot request your own item" });
    }

    // Check if there's already a pending request
    const existingRequest = await ItemRequest.findOne({
      requester: requesterId,
      post: postId,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: "You already have a pending request for this item" });
    }

    // Create the item request
    const itemRequest = new ItemRequest({
      requester: requesterId,
      postOwner: post.user._id,
      post: postId,
      message: message || "",
      requesterContact: {
        email: email || "",
        phone: phone || ""
      }
    });

    await itemRequest.save();

    // Get requester info
    const requester = await User.findById(requesterId);

    // Create notifications for both users
    // 1. Notification for post owner (someone wants their item)
    const ownerNotification = new Notification({
      user: post.user._id,
      caregiver: requesterId,
      relatedModel: "ItemRequest",
      relatedId: itemRequest._id,
      message: `${requester.name} has requested your item "${post.hughandDetails?.title || 'your item'}"`,
      type: "item_request"
    });

    // 2. Notification for requester (confirmation of request)
    const requesterNotification = new Notification({
      user: requesterId,
      caregiver: post.user._id,
      relatedModel: "ItemRequest",
      relatedId: itemRequest._id,
      message: `Your request for "${post.hughandDetails?.title || 'the item'}" has been sent to ${post.user.name}`,
      type: "item_request"
    });

    await Promise.all([ownerNotification.save(), requesterNotification.save()]);

    res.status(201).json({ 
      success: true, 
      message: "Item request sent successfully!",
      request: itemRequest
    });

  } catch (error) {
    console.error("Error creating item request:", error);
    res.status(500).json({ success: false, message: "Failed to create item request" });
  }
});

// ============================
// Get User's Item Requests (both sent and received)
// ============================
router.get("/my-requests", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get requests sent by the user
    const sentRequests = await ItemRequest.find({ requester: userId })
      .populate("post", "hughandDetails content")
      .populate("postOwner", "name profilePic")
      .sort({ createdAt: -1 });

    // Get requests received by the user
    const receivedRequests = await ItemRequest.find({ postOwner: userId })
      .populate("post", "hughandDetails content")
      .populate("requester", "name profilePic")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sentRequests,
      receivedRequests
    });

  } catch (error) {
    console.error("Error fetching item requests:", error);
    res.status(500).json({ success: false, message: "Failed to fetch item requests" });
  }
});

// ============================
// Update Request Status (accept/reject)
// ============================
router.put("/:requestId/status", protect, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // "accepted" or "rejected"
    const userId = req.user._id;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const itemRequest = await ItemRequest.findById(requestId)
      .populate("post", "hughandDetails content")
      .populate("requester", "name")
      .populate("postOwner", "name");

    if (!itemRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Only post owner can update request status
    if (itemRequest.postOwner._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this request" });
    }

    itemRequest.status = status;
    await itemRequest.save();

    // Create notification for requester
    const statusMessage = status === "accepted" 
      ? `Great news! ${itemRequest.postOwner.name} has accepted your request for "${itemRequest.post.hughandDetails?.title || 'the item'}"`
      : `${itemRequest.postOwner.name} has declined your request for "${itemRequest.post.hughandDetails?.title || 'the item'}"`;

    const notification = new Notification({
      user: itemRequest.requester._id,
      caregiver: userId,
      relatedModel: "ItemRequest",
      relatedId: itemRequest._id,
      message: statusMessage,
      type: "item_request"
    });

    await notification.save();

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      request: itemRequest
    });

  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ success: false, message: "Failed to update request status" });
  }
});

module.exports = router;