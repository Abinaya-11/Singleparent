import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, MoreHorizontal, Search, Bell, MessageSquare, User, Menu, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Groovetalks = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Alica Wonderland',
      avatar: 'AW',
      content: 'Just dropped us a fantastic session on "Mindset for Growth" 🌟. It\'s incredible how shifting our perspective can unlock so much potential. Remember, challenges aren\'t roadblocks, they\'re opportunities in disguise. What a vibe mindset shift helped you lately?',
      image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=300&fit=crop',
      likes: 94,
      shares: 22,
      isLiked: false,
      hasComment: true
    },
    {
      id: 2,
      author: 'Bob The Builder',
      avatar: 'BB',
      content: 'Learned a new productivity hack today: the "Pomodoro Technique" combined with deep work blocks. This focus activated was insane! Highly recommend giving it a try if you are struggling with distractions. #ProductivityTips #DeepWork #TimeManagement',
      image: null,
      likes: 86,
      shares: 15,
      isLiked: false,
      hasComment: true
    },
    {
      id: 3,
      author: 'Charlla Chaplin',
      avatar: 'CC',
      content: 'Reflecting on the importance of community in personal and professional growth. This platform has been an incredible platform for connecting with like-minded individuals and sharing insights. What\'s your favorite aspect of this community? 🌍',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=300&fit=crop',
      likes: 221,
      shares: 48,
      isLiked: false,
      hasComment: true
    },
    {
      id: 4,
      author: 'Diana Prince',
      avatar: 'DP',
      content: 'Excited to announce my upcoming webinar on "Sustainable Habits for Long-Term Success"! We\'ll dive deep into strategies proven to stick. Details and registration link coming soon! Stay tuned! #Webinar #SuccessHabits #PersonalDevelopment',
      image: null,
      likes: 156,
      shares: 63,
      isLiked: false,
      hasComment: true
    },
    {
      id: 5,
      author: 'Eve Harrington',
      avatar: 'EH',
      content: 'Reading "The 7 Habits of Highly Effective People" again, and it still hits different. The concepts of Begin with the End in Mind is truly foundational. What\'s a classic book that still impacts you?',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=300&fit=crop',
      likes: 192,
      shares: 31,
      isLiked: false,
      hasComment: true
    }
  ]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };
  
  const goToSection = (sectionId) => {
    navigate("/main", { state: { scrollTo: sectionId } });
  };
  
  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleAddClick = () => {
    navigate("/createpost"); // 🔹 You can replace this route as needed
  };

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
              {post.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author}</h3>
            </div>
          </div>
          <button className="px-4 py-1 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition">
            Connect
          </button>
        </div>
       
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {post.content}
        </p>

        {post.image && (
          <div className="rounded-lg overflow-hidden mb-3">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition"
            >
              <Heart
                className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
           
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>

          <button className="text-gray-400 hover:text-gray-600 transition">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CareGroove</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => navigate("/main")} className="text-gray-700 hover:text-amber-600 cursor-pointer">Home</button>
              <button onClick={() => goToSection("resources")} className="text-gray-700 hover:text-amber-600 cursor-pointer">Explore</button>
              <button onClick={() => goToSection("community")} className="text-gray-700 hover:text-amber-600 cursor-pointer">Community</button>
              <button onClick={() => goToSection("resources")} className="text-gray-700 hover:text-amber-600 cursor-pointer">Resources</button>
              <button onClick={() => navigate("/mynetworks")} className="text-gray-700 hover:text-amber-600 cursor-pointer">My Networks</button>
            </div>
            <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => navigate("/notifications")}>
                  <Bell className="w-6 h-6 text-gray-700" />
                  {notifications?.some(n => n.unread) && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-1 ring-white"></span>
                  )}
                </button>
              </div>
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100 border border-gray-200" onClick={() => setShowDropdown(!showDropdown)}>
                  <User className="w-6 h-6 text-gray-700" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <button onClick={() => { setShowDropdown(false); navigate("/profile"); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">View Profile</button>
                    <button onClick={() => { setShowDropdown(false); handleLogout(); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pt-24">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      {/* Floating Plus Button */}
      <button
        onClick={handleAddClick}
        className="fixed bottom-8 right-8 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">Resources</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Legal</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Groovetalks;
