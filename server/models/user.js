const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true, // prevents duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
});

// Export User model
module.exports = mongoose.model("User", userSchema);
