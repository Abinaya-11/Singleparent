// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

    // NEW fields for profile page
    profilePic: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    interests: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
