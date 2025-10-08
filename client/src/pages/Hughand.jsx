import React, { useState, useRef } from 'react';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Bell,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CareGroovePage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const itemsSectionRef = useRef(null);

  // ✅ Added missing states and handlers
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState([]); // placeholder for notifications array
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    // Placeholder logout logic
    console.log("User logged out");
    navigate("/login");
  };

  const scrollToItems = () => {
    itemsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const items = [
    {
      id: 1,
      category: "Baby Gear",
      title: "Toddler Stroller",
      description: "Gently used, compact stroller suitable for ages 6 months to 3 years. Easy to fold and lightweight. Perfect for daily walks.",
      sender: "Maria Rodriguez",
      email: "maria.r@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Maple Street, Anytown, CA 90210",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      category: "Books & Toys",
      title: "Children's Book Collection",
      description: "Set of 12 colorful storybooks and picture books for ages 3-7. Excellent condition, great for bedtime stories and early reading.",
      sender: "David Chen",
      email: "david.c@example.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Avenue, Cityville, NY 10001",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      category: "Clothing",
      title: "Winter Coat (Child)",
      description: "Warm and cozy winter coat for ages 5-7 years old. Navy blue, with detachable hood. Very good condition, perfect for cold weather.",
      sender: "Sophia Ali",
      email: "sophia.a@example.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine Lane, Townsville, TX 77002",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      category: "Baby Essentials",
      title: "Baby Feeding Set",
      description: "Complete baby feeding set including bottles, sippy cups, and plates. All BPA-free and in new condition. Sterilized and ready to use.",
      sender: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+1 (555) 456-7890",
      address: "101 Elm Drive, Villageton, FL 33101",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      category: "Hobbies",
      title: "Art & Craft Supplies",
      description: "Variety of art and craft supplies for creative kids: colored pencils, markers, construction paper, and glue sticks. Mostly unused.",
      sender: "Emily White",
      email: "emily.w@example.com",
      phone: "+1 (555) 567-8901",
      address: "202 Birch Road, Suburbia, CA 90003",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      category: "Baby Gear",
      title: "High Chair",
      description: "Sturdy and adjustable high chair, easy to clean. Suitable for babies learning to self-feed. Excellent condition with safety harness.",
      sender: "Juan Perez",
      email: "juan.p@example.com",
      phone: "+1 (555) 678-9012",
      address: "303 Cedar Court, Metroville, IL 60606",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 relative">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">CareGroove</span>
                      </div>

          <div className="flex items-center space-x-8">
            <button onClick={() => navigate("/main")} className="text-gray-700 hover:text-amber-600">Home</button>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Explore</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Community</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Resources</a>
            <button onClick={() => navigate("/mynetworks")} className="text-gray-700 hover:text-amber-600">My Networks</button>
          </div>

          <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-gray-100 relative" onClick={() => navigate("/notifications")}>
              <Bell className="w-6 h-6 text-gray-700" />
              {notifications?.some(n => n.unread) && (
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
                    onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => { setShowDropdown(false); handleLogout(); }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Extend a Helping Hand,<br />Receive a Warm Hug.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Parenting isn't meant to be a solo journey. Here, you'll find connection, encouragement, and people who truly understand. Join our 'Hug & Hand' community to share resources, exchange items, and offer mutual support.
            </p>
            <button
              onClick={scrollToItems}
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200"
            >
              Start Helping Today
            </button>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-200 rounded-3xl opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=500&fit=crop"
                alt="Happy family"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Items Section */}
      <section ref={itemsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Items for Exchange & Donation</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find essential items you need or give back to the community by listing items you no longer use. Every little bit helps. Connect with senders directly to facilitate exchanges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow">
                  {item.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>

                <div className="space-y-2 pt-4 border-t">
                  <p className="font-semibold text-gray-900">Sender Details:</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">👤 {item.sender}</p>
                    <p className="flex items-center gap-2"><Mail size={14} /> {item.email}</p>
                    <p className="flex items-center gap-2"><Phone size={14} /> {item.phone}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} /> {item.address}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition">
                    Exchange Item
                  </button>
                  <button className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                    Donate Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Upload Button */}
      <div className="fixed bottom-24 right-8 flex flex-col items-center space-y-2">
        <button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-transform">
          <Plus size={28} />
        </button>
        <span className="text-sm font-semibold text-gray-700">Upload Item</span>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-8 text-sm text-gray-600">
            <a href="#" className="hover:text-orange-500 transition">Company</a>
            <a href="#" className="hover:text-orange-500 transition">Legal</a>
            <a href="#" className="hover:text-orange-500 transition">Support</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-orange-500 transition"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition"><Linkedin size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareGroovePage;
