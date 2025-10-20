const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User who will receive the notification
      required: true,
    },
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User who triggered the notification (for connections, this is the sender)
    },
    relatedModel: {
      type: String,
      enum: ["User", "Caregiver", "Post", "Booking", "Connection", "ItemRequest"],
      default: "User"
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel" // dynamic reference based on relatedModel
    },
    message: {
      type: String,
      required: true, // notification text
    },
    type: {
      type: String,
      enum: ["booking", "connection", "comment", "general", "item_request"], // you can extend as needed
      default: "general",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Notification", notificationSchema);
