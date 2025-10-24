import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Heart, Bell, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CareGrooveLanding() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId"); // assuming you store user ID in localStorage

  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotModal, setSlotModal] = useState({ open: false, caregiver: null });
  const [selectedSlot, setSelectedSlot] = useState("");

  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState([{ unread: true }]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleScrollToCaregivers = () => {
    const section = document.getElementById("caregivers-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch caregivers
  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const res = await axios.get("/api/caregivers");
        setCaregivers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch caregivers:", err);
        setLoading(false);
      }
    };
    fetchCaregivers();
  }, []);

  // Delete caregiver (admin only)
  const handleDeleteCaregiver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this caregiver?")) return;

    try {
      await axios.delete(`/api/caregivers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      alert("Caregiver deleted successfully!");
      setCaregivers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete caregiver.");
    }
  };

  // Open slot selection modal
  const handleBookClick = (caregiver) => {
    setSlotModal({ open: true, caregiver });
    setSelectedSlot("");
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return alert("Please select a slot");

    try {
      const token = localStorage.getItem("userToken");
      const { caregiver } = slotModal;

      // 1️⃣ Create booking on backend
      await axios.post(
        `http://localhost:3000/api/booking`,
        {
          userId: userId, // ✅ must match backend
          caregiverId: caregiver._id,
          slot: selectedSlot,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      // 2️⃣ Create notification for user
      await axios.post(
        `/api/notifications`,
        {
          user: userId,
          caregiver: caregiver._id,
          message: `You booked ${caregiver.name} for slot "${selectedSlot}"`,
          type: "booking",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Create notification for caregiver
      // 3️⃣ Create notification for caregiver
      await axios.post(
        `/api/notifications`,
        {
          user: caregiver._id, // caregiver receives it
          caregiver: userId,   // the user who booked
          message: `New booking from ${localStorage.getItem("userName")} for slot "${selectedSlot}"`,
          type: "booking",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      alert("Booking confirmed!");
      setSlotModal({ open: false, caregiver: null });
    } catch (err) {
      console.error(err);
      alert("Failed to book slot.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading caregivers...</p>;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => navigate("/main")}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                <Heart className="text-white w-4 h-4" />
              </div>
              <span className="text-xl text-gray-800 font-bold">
                Care<span className="text-gray-800 font-bold">Groove</span>
              </span>
            </div>

            <nav className="flex items-center space-x-8">
              <button
                onClick={() => navigate("/main")}
                className="text-gray-700 hover:text-amber-600"
              >
                Home
              </button>
              <a href="#" className="text-gray-700 hover:text-orange-500">Explore</a>
              <a href="#" className="text-gray-700 hover:text-orange-500">Community</a>
              <a href="#" className="text-gray-700 hover:text-orange-500">Resources</a>
              <button
                onClick={() => navigate("/mynetworks")}
                className="text-gray-700 hover:text-amber-600"
              >
                My Networks
              </button>
            </nav>

            <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
              <button
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-1 ring-white"></span>
                )}
              </button>

              <div className="relative">
                <button
                  className="p-1 rounded-full hover:bg-gray-100 border border-gray-200"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <User className="w-6 h-6 text-gray-700" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/profile");
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-orange-50 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Ideal Caregiver with Ease.
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            CareGroove Daycare connects you with trusted parents and guardians
            offering flexible, loving care for your children, right within your
            community.
          </p>
          <button
            onClick={handleScrollToCaregivers}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Caregivers
          </button>
        </div>
      </section>

      {/* Caregivers Section */}
      <section id="caregivers-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Trusted Caregivers
          </h2>

          {/* Admin-only Add Caregiver Button */}
          {role === "admin" && (
            <div className="flex justify-center mb-10">
              <button
                onClick={() => navigate("/addcaregiver")}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow-md font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Caregiver
              </button>
            </div>
          )}

          {caregivers.length === 0 ? (
            <p className="text-center text-gray-500">No caregivers have been added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caregivers.map((caregiver) => (
                <div
                  key={caregiver._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Profile Picture - First */}
                  <div className="flex justify-center mb-4">
                    {caregiver.image ? (
                      <img
                        src={caregiver.image}
                        alt={caregiver.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          const fallback = document.createElement('div');
                          fallback.className = 'w-24 h-24 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center';
                          fallback.innerHTML = `<span class="text-white text-3xl font-bold">${caregiver.name[0].toUpperCase()}</span>`;
                          parent.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{caregiver.name[0].toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Name and Details - Second */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {caregiver.name}
                    </h3>
                    {caregiver.age && (
                      <p className="text-sm text-gray-500 mb-2">{caregiver.age} years old</p>
                    )}
                    <div className="flex items-center justify-center mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-orange-500 fill-orange-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.852L19.335 24 12 19.897 4.665 24 6 15.6 0 9.748l8.332-1.73z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium">
                        {caregiver.rating || "N/A"}
                      </span>
                      {caregiver.verified && (
                        <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 text-center">
                    {caregiver.description}
                  </p>

                  {caregiver.slots && caregiver.slots.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Available Slots</h4>
                      {caregiver.slots.map((slot, idx) => (
                        <p key={idx} className="text-xs text-gray-600 mb-1">{slot}</p>
                      ))}
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                    {caregiver.contact && (
                      <>
                        <p className="text-xs text-gray-600">{caregiver.contact.phone}</p>
                        <p className="text-xs text-gray-600">{caregiver.contact.email}</p>
                        <p className="text-xs text-gray-600">{caregiver.contact.address}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleBookClick(caregiver)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors mb-2"
                  >
                    Book Now
                  </button>

                  {/* Admin-only Delete button */}
                  {role === "admin" && (
                    <button
                      onClick={() => handleDeleteCaregiver(caregiver._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Delete Caregiver
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* Slot Modal */}
      {slotModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Select a Slot</h3>
            {slotModal.caregiver.slots.map((slot, idx) => (
              <div key={idx} className="mb-2">
                <input
                  type="radio"
                  name="slot"
                  value={slot}
                  checked={selectedSlot === slot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="mr-2"
                />
                {slot}
              </div>
            ))}
            <button
              onClick={handleConfirmBooking}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => setSlotModal({ open: false, caregiver: null })}
              className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 CareGroove. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
