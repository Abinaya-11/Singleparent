const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "CareGroove Main Community"
    },
    description: {
      type: String,
      default: "The main community for all CareGroove members to connect, share, and support each other."
    },
    isMainCommunity: {
      type: Boolean,
      default: true
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      role: {
        type: String,
        enum: ["member", "admin", "moderator"],
        default: "member"
      }
    }],
    memberCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Update member count before saving
communitySchema.pre('save', function() {
  this.memberCount = this.members.length;
});

module.exports = mongoose.model("Community", communitySchema);