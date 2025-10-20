import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function AddCaregiver() {
  const navigate = useNavigate();

  // ✅ Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState([""]);
  const [image, setImage] = useState("");

  const handleAddSlot = () => setSlots([...slots, ""]);
  const handleSlotChange = (index, value) => {
    const newSlots = [...slots];
    newSlots[index] = value;
    setSlots(newSlots);
  };
  const handleRemoveSlot = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Simple validation
    if (!name || !email || !phone || !description) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const caregiverData = {
        name,
        age,
        email,
        phone,
        address,
        description,
        slots,
        image,
      };

      // Send data to backend (replace with your actual endpoint)
      await axios.post("/api/caregivers", caregiverData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });

      alert("Caregiver added successfully!");
      navigate("/daycare"); // Go back to Daycare page
    } catch (error) {
      console.error(error);
      alert("Failed to add caregiver. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate("/daycare")}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Daycare
            </button>
            <h1 className="text-xl font-bold text-gray-900">Add New Caregiver</h1>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg p-8 shadow-md"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Full Name"
                required
              />
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Age"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Phone Number"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Address"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Brief description of caregiver skills"
                required
              />
            </div>

            {/* Slots Section */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Available Slots</label>
              {slots.map((slot, index) => (
                <div key={index} className="flex items-center mb-2 gap-2">
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => handleSlotChange(index, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g., Monday: 9:00 AM - 1:00 PM"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSlot}
                className="flex items-center gap-1 mt-2 text-orange-500 hover:text-orange-600"
              >
                <Plus className="w-4 h-4" />
                Add Slot
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Paste image URL"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Add Caregiver
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
