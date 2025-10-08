import React, { useState, useRef } from "react";
import {
  Heart,
  Bell,
  User,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CareGrooveJobs() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [notifications] = useState([{ unread: true }]); // example notification

  // Temporary logout handler (can be replaced with real logic)
  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/login");
  };

  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "Remote",
      description:
        "Develop scalable software solutions for our cloud platform. Work with a dynamic team and make real impact.",
      salary: "$120,000 - $150,000",
      type: "Full-time",
      posted: "2 days ago",
      icon: "💻",
    },
    {
      id: 2,
      title: "Lead UI/UX Designer",
      company: "Creative Design Studio",
      location: "New York, NY",
      description:
        "Shape the user experience for our flagship product. Collaborate with product and engineering teams.",
      salary: "$100,000 - $130,000",
      type: "Full-time",
      posted: "3 days ago",
      icon: "🎨",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Global Solutions Co.",
      location: "London, UK",
      description:
        "Analyze datasets, build predictive models, and deliver actionable insights for business growth.",
      salary: "$110,000 - $140,000",
      type: "Full-time",
      posted: "1 week ago",
      icon: "📊",
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      company: "Marketing Growth Agency",
      location: "Remote",
      description:
        "Develop and execute digital campaigns. Drive engagement and brand awareness.",
      salary: "$70,000 - $90,000",
      type: "Full-time",
      posted: "5 days ago",
      icon: "📱",
    },
    {
      id: 5,
      title: "Financial Analyst",
      company: "Finance Hub Inc.",
      location: "Chicago, IL",
      description:
        "Perform financial modeling and prepare reports to support strategic investment decisions.",
      salary: "$85,000 - $110,000",
      type: "Full-time",
      posted: "4 days ago",
      icon: "💰",
    },
    {
      id: 6,
      title: "Product Manager",
      company: "Healthcare Innovators",
      location: "Boston, MA",
      description:
        "Define product strategy for healthcare tech solutions. Lead cross-functional collaboration.",
      salary: "$130,000 - $160,000",
      type: "Full-time",
      posted: "2 weeks ago",
      icon: "🎯",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                CareGroove 
              </span>
            </div>

            {/* Navigation */}
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
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Your Next Opportunity
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore opportunities that match your passion and skills. Your
            future begins with CareGroove.
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl">
                  {job.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {job.company} - {job.location}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {job.description}
              </p>

              <div className="flex items-center text-sm text-gray-600 mb-4 flex-wrap gap-2">
                <span className="font-medium">{job.salary}</span>
                <span>•</span>
                <span>{job.type}</span>
                <span>•</span>
                <span>{job.posted}</span>
              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4">
              <a href="#" className="p-2 hover:bg-gray-100 rounded-full">
                <Linkedin className="w-5 h-5 text-gray-700" />
              </a>
              <a href="#" className="p-2 hover:bg-gray-100 rounded-full">
                <Twitter className="w-5 h-5 text-gray-700" />
              </a>
              <a href="#" className="p-2 hover:bg-gray-100 rounded-full">
                <Facebook className="w-5 h-5 text-gray-700" />
              </a>
              <a href="#" className="p-2 hover:bg-gray-100 rounded-full">
                <Youtube className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Plus Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group">
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
