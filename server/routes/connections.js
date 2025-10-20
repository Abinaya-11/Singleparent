const express = require("express");
const router = express.Router();
const Connection = require("../models/Connection");
const Notification = require("../models/Notification");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/connections/request
// @desc    Send connection request
// @access  Private
router.post("/request", protect, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id;

    // Check if users are trying to connect to themselves
    if (requesterId.toString() === recipientId) {
      return res.status(400).json({ message: "Cannot connect to yourself" });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findConnection(requesterId, recipientId);
    if (existingConnection) {
      return res.status(400).json({ 
        message: "Connection already exists or request already sent",
        status: existingConnection.status
      });
    }

    // Get recipient details
    const recipient = await User.findById(recipientId).select("name email");
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create connection request
    const connection = new Connection({
      requester: requesterId,
      recipient: recipientId
    });

    await connection.save();

    // Create notification for recipient
    const notification = new Notification({
      user: recipientId,
      caregiver: requesterId,
      message: `${req.user.name} wants to connect with you!`,
      type: "connection"
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      connection
    });
  } catch (err) {
    console.error("Connection request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/connections/accept/:connectionId
// @desc    Accept connection request
// @access  Private
router.put("/accept/:connectionId", protect, async (req, res) => {
  try {
    const connectionId = req.params.connectionId;
    const userId = req.user._id;

    const connection = await Connection.findById(connectionId).populate("requester", "name");
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Check if current user is the recipient
    if (connection.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    // Check if already processed
    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Connection request already processed" });
    }

    // Accept the connection
    connection.status = "accepted";
    await connection.save();

    // Create notification for requester
    const notification = new Notification({
      user: connection.requester._id,
      message: `${req.user.name} accepted your connection request!`,
      type: "connection"
    });

    await notification.save();

    res.json({
      success: true,
      message: "Connection request accepted",
      connection
    });
  } catch (err) {
    console.error("Accept connection error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/connections/decline/:connectionId
// @desc    Decline connection request
// @access  Private
router.put("/decline/:connectionId", protect, async (req, res) => {
  try {
    const connectionId = req.params.connectionId;
    const userId = req.user._id;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Check if current user is the recipient
    if (connection.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to decline this request" });
    }

    // Decline the connection
    connection.status = "declined";
    await connection.save();

    res.json({
      success: true,
      message: "Connection request declined"
    });
  } catch (err) {
    console.error("Decline connection error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/connections/my-connections
// @desc    Get user's accepted connections with full profile data
// @access  Private
router.get("/my-connections", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get connections with populated user data
    const connections = await Connection.find({
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" }
      ]
    })
    .populate("requester", "name email profilePic bio location interests createdAt")
    .populate("recipient", "name email profilePic bio location interests createdAt")
    .sort({ updatedAt: -1 }); // Most recently updated connections first

    // Format the response to return connected user details with enhanced data
    const connectedUsers = connections.map(conn => {
      const connectedUser = conn.requester._id.toString() === userId.toString() 
        ? conn.recipient 
        : conn.requester;
      
      return {
        _id: connectedUser._id,
        name: connectedUser.name,
        email: connectedUser.email,
        profilePic: connectedUser.profilePic,
        bio: connectedUser.bio || "",
        location: connectedUser.location || "",
        interests: connectedUser.interests || [],
        memberSince: connectedUser.createdAt,
        connectionDate: conn.createdAt,
        connectionUpdated: conn.updatedAt,
        connectionId: conn._id
      };
    });

    // Calculate connection stats
    const stats = {
      total: connectedUsers.length,
      thisWeek: connectedUsers.filter(user => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(user.connectionDate) > oneWeekAgo;
      }).length,
      thisMonth: connectedUsers.filter(user => {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return new Date(user.connectionDate) > oneMonthAgo;
      }).length
    };

    res.json({
      success: true,
      connections: connectedUsers,
      stats
    });
  } catch (err) {
    console.error("Get connections error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/connections/pending
// @desc    Get pending connection requests for current user
// @access  Private
router.get("/pending", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const pendingRequests = await Connection.getPendingRequests(userId);

    res.json({
      success: true,
      requests: pendingRequests
    });
  } catch (err) {
    console.error("Get pending requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/connections/stats
// @desc    Get detailed network statistics
// @access  Private
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all connections
    const allConnections = await Connection.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    }).sort({ createdAt: -1 });
    
    const acceptedConnections = allConnections.filter(conn => conn.status === "accepted");
    const pendingConnections = allConnections.filter(conn => conn.status === "pending");
    
    // Time-based stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: acceptedConnections.length,
      pending: pendingConnections.length,
      thisWeek: acceptedConnections.filter(conn => conn.createdAt > oneWeekAgo).length,
      thisMonth: acceptedConnections.filter(conn => conn.createdAt > oneMonthAgo).length,
      lastThreeMonths: acceptedConnections.filter(conn => conn.createdAt > threeMonthsAgo).length,
      recentActivity: allConnections.slice(0, 5).map(conn => ({
        type: conn.status === "accepted" ? "connection_accepted" : "connection_requested",
        date: conn.status === "accepted" ? conn.updatedAt : conn.createdAt,
        otherUserId: conn.requester.toString() === userId.toString() ? conn.recipient : conn.requester
      }))
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (err) {
    console.error("Get network stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/connections/remove/:connectionId
// @desc    Remove/disconnect from a connection
// @access  Private
router.delete("/remove/:connectionId", protect, async (req, res) => {
  try {
    const connectionId = req.params.connectionId;
    const userId = req.user._id;

    const connection = await Connection.findById(connectionId).populate("requester recipient", "name");
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Check if current user is part of this connection
    const isRequester = connection.requester._id.toString() === userId.toString();
    const isRecipient = connection.recipient._id.toString() === userId.toString();
    
    if (!isRequester && !isRecipient) {
      return res.status(403).json({ message: "Not authorized to remove this connection" });
    }

    // Check if connection is accepted
    if (connection.status !== "accepted") {
      return res.status(400).json({ message: "Can only remove accepted connections" });
    }

    // Remove the connection
    await Connection.findByIdAndDelete(connectionId);

    // Get the other user's details for notification
    const otherUser = isRequester ? connection.recipient : connection.requester;
    
    // Create notification for the other user
    const notification = new Notification({
      user: otherUser._id,
      message: `${req.user.name} has disconnected from you`,
      type: "connection"
    });

    await notification.save();

    res.json({
      success: true,
      message: "Connection removed successfully"
    });
  } catch (err) {
    console.error("Remove connection error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/connections/status/:userId
// @desc    Get connection status with specific user
// @access  Private
router.get("/status/:userId", protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    const connection = await Connection.findConnection(currentUserId, targetUserId);
    
    if (!connection) {
      return res.json({ 
        connected: false, 
        status: "none" 
      });
    }

    res.json({
      connected: connection.status === "accepted",
      status: connection.status,
      connectionId: connection._id,
      isRequester: connection.requester.toString() === currentUserId.toString()
    });
  } catch (err) {
    console.error("Get connection status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;