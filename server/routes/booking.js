const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const Caregiver = require("../models/Caregiver");

// POST booking
router.post("/", async (req, res) => {
  try {
    const { userId, caregiverId, slot } = req.body;

    const booking = new Booking({
      user: userId,
      caregiver: caregiverId,
      slot,
    });
    const savedBooking = await booking.save();

    // Create notifications for both user and caregiver
    const userNotification = new Notification({
      user: userId,
      message: `You have booked ${slot} with your caregiver.`,
    });
    const caregiverNotification = new Notification({
      user: caregiverId,
      message: `You have a new booking for ${slot}.`,
    });

    await userNotification.save();
    await caregiverNotification.save();

    res.status(201).json({ booking: savedBooking, message: "Booking successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET bookings for a user or caregiver
router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate("caregiver");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
