const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  address: { type: String },
});

const caregiverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    description: { type: String, required: true },
    slots: { type: [String], default: [] },
    image: { type: String },
    contact: { type: contactSchema },
    rating: { type: Number, default: 0 },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Caregiver", caregiverSchema);
