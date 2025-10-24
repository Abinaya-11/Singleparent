const express = require("express");
const router = express.Router();
const Community = require("../models/Community");
const Event = require("../models/Event");
const Chat = require("../models/Chat");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

// ============================
// Get or Create Main Community
// ============================
const getOrCreateMainCommunity = async () => {
  let mainCommunity = await Community.findOne({ isMainCommunity: true });
  
  if (!mainCommunity) {
    mainCommunity = new Community({
      name: "CareGroove Main Community",
      description: "The main community for all CareGroove members to connect, share, and support each other.",
      isMainCommunity: true,
      members: [],
      isActive: true
    });
    await mainCommunity.save();
  }
  
  return mainCommunity;
};

// ============================
// Join Main Community
// ============================
router.post("/join", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get or create the main community
    const mainCommunity = await getOrCreateMainCommunity();
    
    // Check if user is already a member
    const existingMember = mainCommunity.members.find(
      member => member.user.toString() === userId.toString()
    );
    
    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: "You are already a member of the community" 
      });
    }
    
    // Add user to community
    mainCommunity.members.push({
      user: userId,
      joinedAt: new Date(),
      role: "member"
    });
    
    await mainCommunity.save();
    
    // Create welcome notification for the user
    const welcomeNotification = new Notification({
      user: userId,
      message: `Welcome to ${mainCommunity.name}! You're now part of a supportive community of single parents.`,
      type: "general"
    });
    
    await welcomeNotification.save();
    
    res.status(200).json({
      success: true,
      message: "Successfully joined the community!",
      community: {
        name: mainCommunity.name,
        memberCount: mainCommunity.memberCount,
        joinedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to join community" 
    });
  }
});

// ============================
// Check Community Membership Status
// ============================
router.get("/membership-status", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const mainCommunity = await getOrCreateMainCommunity();
    
    const isMember = mainCommunity.members.some(
      member => member.user.toString() === userId.toString()
    );
    
    const memberInfo = isMember 
      ? mainCommunity.members.find(member => member.user.toString() === userId.toString())
      : null;
    
    res.json({
      success: true,
      isMember,
      community: {
        name: mainCommunity.name,
        description: mainCommunity.description,
        memberCount: mainCommunity.memberCount
      },
      memberInfo: memberInfo ? {
        joinedAt: memberInfo.joinedAt,
        role: memberInfo.role
      } : null
    });
    
  } catch (error) {
    console.error("Error checking membership status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check membership status" 
    });
  }
});

// ============================
// Get Community Details
// ============================
router.get("/main", protect, async (req, res) => {
  try {
    const mainCommunity = await Community.findOne({ isMainCommunity: true })
      .populate('members.user', 'name profilePic');
    
    if (!mainCommunity) {
      const newCommunity = await getOrCreateMainCommunity();
      return res.json({
        success: true,
        community: newCommunity
      });
    }
    
    res.json({
      success: true,
      community: mainCommunity
    });
    
  } catch (error) {
    console.error("Error fetching community details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch community details" 
    });
  }
});

// ============================
// Leave Community (optional feature)
// ============================
router.post("/leave", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const mainCommunity = await Community.findOne({ isMainCommunity: true });
    
    if (!mainCommunity) {
      return res.status(404).json({ 
        success: false, 
        message: "Community not found" 
      });
    }
    
    // Remove user from community
    mainCommunity.members = mainCommunity.members.filter(
      member => member.user.toString() !== userId.toString()
    );
    
    await mainCommunity.save();
    
    res.json({
      success: true,
      message: "Successfully left the community"
    });
    
  } catch (error) {
    console.error("Error leaving community:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to leave community" 
    });
  }
});

// ============================
// Get Community Members
// ============================
router.get("/members", protect, async (req, res) => {
  try {
    const mainCommunity = await Community.findOne({ isMainCommunity: true })
      .populate('members.user', 'name profilePic email')
      .select('members name memberCount');
    
    if (!mainCommunity) {
      return res.status(404).json({ 
        success: false, 
        message: "Community not found" 
      });
    }
    
    // Check if current user is a member
    const userId = req.user._id;
    const isMember = mainCommunity.members.some(
      member => member.user._id.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be a community member to view members" 
      });
    }
    
    res.json({
      success: true,
      members: mainCommunity.members,
      totalMembers: mainCommunity.memberCount
    });
    
  } catch (error) {
    console.error("Error fetching community members:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch community members" 
    });
  }
});

// ============================
// Create Event
// ============================
router.post("/events", protect, async (req, res) => {
  try {
    const { title, description, date, time, location, type, maxAttendees } = req.body;
    const userId = req.user._id;
    
    // Get main community
    const mainCommunity = await getOrCreateMainCommunity();
    
    // Check if user is a community member
    const isMember = mainCommunity.members.some(
      member => member.user.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be a community member to create events" 
      });
    }
    
    const newEvent = new Event({
      title,
      description: description || "",
      date: new Date(date),
      time,
      location: location || "",
      type: type || "Community",
      organizer: userId,
      maxAttendees: maxAttendees || null,
      community: mainCommunity._id,
      attendees: [{ user: userId, status: "attending" }]
    });
    
    await newEvent.save();
    
    // Populate organizer info for response
    await newEvent.populate('organizer', 'name profilePic');
    
    // Notify all community members about the new event
    const eventDate = new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Create notifications for all community members (except the organizer)
    const notificationPromises = mainCommunity.members
      .filter(member => member.user.toString() !== userId.toString())
      .map(member => {
        return new Notification({
          user: member.user,
          caregiver: userId,
          relatedModel: "Event",
          relatedId: newEvent._id,
          message: `New community event "${title}" scheduled for ${eventDate} at ${time}`,
          type: "general"
        }).save();
      });
    
    await Promise.all(notificationPromises);
    
    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: newEvent
    });
    
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create event" 
    });
  }
});

// ============================
// Get Community Events
// ============================
router.get("/events", protect, async (req, res) => {
  try {
    const mainCommunity = await getOrCreateMainCommunity();
    
    // Check if user is a community member
    const userId = req.user._id;
    const isMember = mainCommunity.members.some(
      member => member.user.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be a community member to view events" 
      });
    }
    
    // Get upcoming events
    const events = await Event.find({ 
      community: mainCommunity._id,
      isActive: true,
      date: { $gte: new Date() } // Only future events
    })
    .populate('organizer', 'name profilePic')
    .sort({ date: 1 })
    .limit(20);
    
    // Format events for frontend
    const formattedEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      time: event.time,
      location: event.location,
      type: event.type,
      organizer: event.organizer,
      attendeesCount: event.attendees.length,
      maxAttendees: event.maxAttendees
    }));
    
    res.json({
      success: true,
      events: formattedEvents
    });
    
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch events" 
    });
  }
});

// ============================
// Get Events for Specific Date
// ============================
router.get("/events/date/:date", protect, async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;
    
    // Get main community
    const mainCommunity = await getOrCreateMainCommunity();
    
    // Check if user is a community member
    const isMember = mainCommunity.members.some(
      member => member.user.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be a community member to view events" 
      });
    }
    
    // Parse the date and get start/end of day
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get events for the specific date
    const events = await Event.find({ 
      community: mainCommunity._id,
      isActive: true,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .populate('organizer', 'name profilePic')
    .sort({ date: 1 });
    
    // Format events for frontend
    const formattedEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      }),
      time: event.time,
      location: event.location,
      type: event.type,
      organizer: event.organizer,
      attendeesCount: event.attendees.length,
      maxAttendees: event.maxAttendees
    }));
    
    res.json({
      success: true,
      events: formattedEvents,
      date: selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
    });
    
  } catch (error) {
    console.error("Error fetching events for date:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch events for date" 
    });
  }
});

// ============================
// Send Chat Message
// ============================
router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;
    
    if (!message || message.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Message cannot be empty" 
      });
    }
    
    // Get main community
    const mainCommunity = await getOrCreateMainCommunity();
    
    // Check if user is a community member
    const isMember = mainCommunity.members.some(
      member => member.user.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be a community member to send messages" 
      });
    }
    
    const newMessage = new Chat({
      message: message.trim(),
      sender: userId,
      community: mainCommunity._id
    });
    
    await newMessage.save();
    
    // Populate sender info for response
    await newMessage.populate('sender', 'name profilePic');
    
    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      chat: newMessage
    });
    
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message" 
    });
  }
});

// ============================
// Get Chat Messages
// ============================
router.get("/chat", protect, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;
    
    // Get main community
    const mainCommunity = await getOrCreateMainCommunity();
    
    // Check if user is a community member
    const isMember = mainCommunity.members.some(
      member => member.user.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be a community member to view chat" 
      });
    }
    
    // Get chat messages
    const messages = await Chat.find({ 
      community: mainCommunity._id,
      isDeleted: false
    })
    .populate('sender', 'name profilePic')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    // Reverse to show oldest first
    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      message: msg.message,
      sender: {
        id: msg.sender._id.toString(),
        name: msg.sender.name,
        profilePic: msg.sender.profilePic
      },
      time: msg.formattedTime,
      createdAt: msg.createdAt,
      isEdited: msg.isEdited
    }));
    
    res.json({
      success: true,
      messages: formattedMessages
    });
    
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch messages" 
    });
  }
});

// ============================
// Delete Chat Message
// ============================
router.delete("/chat/:messageId", protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    
    // Find the message
    const message = await Chat.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }
    
    // Check if the user is the sender of the message
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete your own messages" 
      });
    }
    
    // Soft delete the message
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();
    
    res.json({
      success: true,
      message: "Message deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting chat message:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete message" 
    });
  }
});

module.exports = router;
