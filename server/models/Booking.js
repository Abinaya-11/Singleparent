const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caregiver: { type: mongoose.Schema.Types.ObjectId, ref: "Caregiver", required: true },
    slot: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Pending, Confirmed, Completed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
