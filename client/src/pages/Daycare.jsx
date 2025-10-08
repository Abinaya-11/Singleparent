import React, { useState, useRef } from "react";
import { Heart, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CareGrooveLanding() {
  const navigate = useNavigate();

  // ✅ State and ref initialization
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [notifications] = useState([{ unread: true }]); // example notification

  const handleLogout = () => {
    // handle logout logic here
    navigate("/login");
  };

  const caregivers = [
    {
      name: "Anya Sharma",
      age: 32,
      rating: 4.8,
      verified: true,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      description:
        "Passionate early childhood educator specializing in Montessori methods and nurturing environments for children aged 0-5. Dedicated to providing a safe, joyful space for your little ones.",
      slots: [
        "Monday: 8:00 AM - 1:00 PM",
        "Tuesday: 2:00 PM - 6:00 PM",
        "Wednesday: All Day",
        "Thursday: All Day",
        "Friday: 9:00 AM - 5:00 PM",
      ],
      contact: {
        phone: "+1 (555) 123-4567",
        email: "anya.sharma@example.com",
        address: "123 Maple St, Anytown, CA 90210",
      },
    },
    {
      name: "David Lee",
      age: 45,
      rating: 4.7,
      verified: true,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      description:
        "Experienced father of two, offering creative childcare. Focus on outdoor activities, storytelling, and fostering curiosity. Certified in pediatric first aid.",
      slots: [
        "Monday: All Day",
        "Tuesday: 9:00 AM - 1:00 PM",
        "Wednesday: 2:00 PM - 6:00 PM",
        "Thursday: 11:00 AM - 3:00 PM",
        "Friday: 9:00 AM - 1:00 PM",
      ],
      contact: {
        phone: "+1 (555) 987-6543",
        email: "david.lee@example.com",
        address: "456 Oak Ave, Someville, NY 10001",
      },
    },
    {
      name: "Maria Garcia",
      age: 28,
      rating: 4.8,
      verified: true,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      description:
        "Nurturing caregiver with a background in early childhood development. Loves engaging children in educational games, arts, and crafts. Fluent in English and Spanish.",
      slots: [
        "Monday: 10:00 AM - 3:00 PM",
        "Tuesday: All Day",
        "Wednesday: 10:00 AM - 5:00 PM",
        "Thursday: 2:30 PM - 6:00 PM",
        "Friday: 10:00 AM - 3:00 PM",
      ],
      contact: {
        phone: "+1 (555) 234-5678",
        email: "maria.garcia@example.com",
        address: "789 Pine Ln, Metropolis, TX 75001",
      },
    },
  ];

  const handleScrollToCaregivers = () => {
    const section = document.getElementById("caregivers-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Updated Logo Section */}
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

            {/* Navigation Menu */}
            <nav className="flex items-center space-x-8">
              <button
                onClick={() => navigate("/main")}
                className="text-gray-700 hover:text-amber-600"
              >
                Home
              </button>
              <a href="#" className="text-gray-700 hover:text-orange-500">
                Explore
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500">
                Community
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500">
                Resources
              </a>
              <button
                onClick={() => navigate("/mynetworks")}
                className="text-gray-700 hover:text-amber-600"
              >
                My Networks
              </button>
            </nav>

            {/* Notification & Profile */}
            <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
              {/* Notifications */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-1 ring-white"></span>
                )}
              </button>

              {/* Profile Dropdown */}
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

      {/* Hero Section */}
      <section className="bg-orange-50 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Ideal Caregiver with Ease.
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            CareGroove Daycare connects you with trusted parents and guardians offering
            flexible, loving care for your children, right within your community.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caregivers.map((caregiver, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={caregiver.image}
                    alt={caregiver.name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">{caregiver.name}</h3>
                  <p className="text-sm text-gray-500">{caregiver.age} years old</p>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-orange-500 fill-orange-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.852L19.335 24 12 19.897 4.665 24 6 15.6 0 9.748l8.332-1.73z" />
                    </svg>
                    <span className="ml-1 text-sm font-medium">{caregiver.rating}</span>
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

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Available Slots</h4>
                  {caregiver.slots.map((slot, idx) => (
                    <p key={idx} className="text-xs text-gray-600 mb-1">
                      {slot}
                    </p>
                  ))}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                  <p className="text-xs text-gray-600">{caregiver.contact.phone}</p>
                  <p className="text-xs text-gray-600">{caregiver.contact.email}</p>
                  <p className="text-xs text-gray-600">{caregiver.contact.address}</p>
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 CareGroove. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
