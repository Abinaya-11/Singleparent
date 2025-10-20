const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    requester: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "declined"], 
      default: "pending" 
    },
  },
  { 
    timestamps: true 
  }
);

// Compound index to prevent duplicate connection requests
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Static methods for common queries
connectionSchema.statics.findConnection = function(userId1, userId2) {
  return this.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 }
    ]
  });
};

connectionSchema.statics.getConnectedUsers = function(userId) {
  return this.find({
    $or: [
      { requester: userId, status: "accepted" },
      { recipient: userId, status: "accepted" }
    ]
  }).populate("requester recipient", "name email profilePic");
};

connectionSchema.statics.getPendingRequests = function(userId) {
  return this.find({
    recipient: userId,
    status: "pending"
  }).populate("requester", "name email profilePic");
};

module.exports = mongoose.model("Connection", connectionSchema);