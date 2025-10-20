const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Mark a notification as read
router.put("/read/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.status(200).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

  // Create a new notification
router.post("/", async (req, res) => {
  try {
    const { user, caregiver, message, type } = req.body;

    const newNotification = new Notification({
      user,
      caregiver,
      message,
      type,
    });

    await newNotification.save();
    res.status(201).json({ success: true, message: "Notification created!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
