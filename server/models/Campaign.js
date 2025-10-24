const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    bankAccount: {
      type: String,
      default: ""
    },
    ifsc: {
      type: String,
      default: ""
    },
    upi: {
      type: String,
      default: ""
    },
    goal: {
      type: Number,
      required: true,
      min: 0
    },
    raised: {
      type: Number,
      default: 0,
      min: 0
    },
    image: {
      type: String,
      default: ""
    },
    priority: {
      type: String,
      enum: ["most-urgent", "recently-added", "highest-funded"],
      default: "most-urgent"
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
campaignSchema.index({ priority: 1, createdAt: -1 });
campaignSchema.index({ raised: -1 });

module.exports = mongoose.model("Campaign", campaignSchema);
