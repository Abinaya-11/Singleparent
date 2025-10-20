const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["Online Meetup", "Workshop", "Local Meetup", "Webinar", "Community", "Wellness", "Reading", "Internal"],
      default: "Community"
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    attendees: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      status: {
        type: String,
        enum: ["attending", "maybe", "not_attending"],
        default: "attending"
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }],
    maxAttendees: {
      type: Number,
      default: null // null means unlimited
    },
    isActive: {
      type: Boolean,
      default: true
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);