const mongoose = require("mongoose");

const itemRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
    },
    requesterContact: {
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItemRequest", itemRequestSchema);