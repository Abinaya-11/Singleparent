const express = require("express");
const router = express.Router();
const Caregiver = require("../models/Caregiver");

// GET all caregivers
router.get("/", async (req, res) => {
  try {
    const caregivers = await Caregiver.find();
    res.status(200).json(caregivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new caregiver
router.post("/", async (req, res) => {
  try {
    const { name, age, email, phone, address, description, slots, image } = req.body;

    const caregiver = new Caregiver({
      name,
      age,
      email,
      phone,
      address,
      description,
      slots,
      image,
      contact: { phone, email, address },
    });

    const savedCaregiver = await caregiver.save();
    res.status(201).json(savedCaregiver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a caregiver by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const caregiver = await Caregiver.findByIdAndDelete(id);

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    res.status(200).json({ message: "Caregiver deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
