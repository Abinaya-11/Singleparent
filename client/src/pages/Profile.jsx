import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Users, 
  MapPin, 
  FileText, 
  Bell, 
  Target, 
  Paperclip, 
  Image 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GrowConnectProfile({ notifications, setNotifications }) {
  const [activeTab, setActiveTab] = useState('posts');
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileFile, setProfileFile] = useState(null); 
  const [profilePic, setProfilePic] = useState(''); 
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const interestOptions = ["UI/UX Design", "Product Management", "Storytelling", "Prototyping", "Communication", "Figma"];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  // Fetch profile
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const u = res.data.user;

        setUser(u);
        setProfilePic(u.profilePic ? `/${u.profilePic}` : '');
        setLocation(u.location || '');
        setBio(u.bio || '');

        let parsedInterests = [];
        if (Array.isArray(u.interests)) {
          parsedInterests = u.interests;
        } else if (typeof u.interests === 'string') {
          try {
            parsedInterests = JSON.parse(u.interests || "[]");
            if (!Array.isArray(parsedInterests)) {
              parsedInterests = parsedInterests ? [parsedInterests] : [];
            }
          } catch (e) {
            parsedInterests = u.interests ? [u.interests] : [];
          }
        } else {
          parsedInterests = [];
        }
        setInterests(parsedInterests);

        // Fetch user's posts and thoughts if available
        setPosts(res.data.user.posts || []);
        setThoughts(res.data.user.thoughts || []);

        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        localStorage.removeItem("userToken");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle profile update with FormData
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();

      if (profileFile) formData.append("profilePic", profileFile);
      formData.append("location", location);
      formData.append("bio", bio);
      formData.append("interests", JSON.stringify(interests));

      const res = await axios.put("/api/user/profile", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setUser(res.data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!user) return <div className="p-6">No profile found</div>;

  const goToSection = (sectionId) => {
    navigate("/main", { state: { scrollTo: sectionId } });
  };

  // Component for Create Post flow (button → box → post → back to button)
  const CreatePostFlow = ({ type }) => {
    const [showBox, setShowBox] = useState(false);
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [docFile, setDocFile] = useState(null);

    const handleAddPost = () => {
      if (!content.trim() && !imageFile && !docFile) return;

      const newPost = {
        id: Date.now(),
        content,
        image: imageFile ? URL.createObjectURL(imageFile) : null,
        doc: docFile ? docFile.name : null,
        type
      };

      if (type === 'job') setPosts(prev => [newPost, ...prev]);
      else setThoughts(prev => [newPost, ...prev]);

      setContent('');
      setImageFile(null);
      setDocFile(null);
      setShowBox(false); // Back to button after posting
    };

    if (!showBox) {
      return (
        <button
          onClick={() => setShowBox(true)}
          className="w-full bg-white border-dashed border-2 border-gray-300 text-amber-600 font-medium py-2 rounded-lg flex items-center justify-center hover:bg-gray-50 mb-4"
        >
          <span className="text-lg font-bold mr-2">+</span> Create {type === 'job' ? 'Job Post' : 'Personal Thought'}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col space-y-2 mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's your ${type === 'job' ? 'Job Post' : 'Thought'}?`}
          className="border p-2 rounded w-full"
        />
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-amber-600">
            <Image className="w-5 h-5" /> Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])}/>
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-amber-600">
            <Paperclip className="w-5 h-5" /> File
            <input type="file" className="hidden" onChange={(e) => setDocFile(e.target.files[0])}/>
          </label>
          <button onClick={handleAddPost} className="ml-auto bg-amber-500 text-white px-3 py-1 rounded">Post</button>
          <button onClick={() => setShowBox(false)} className="ml-2 bg-gray-300 px-3 py-1 rounded">Cancel</button>
        </div>
        {imageFile && <p className="text-sm text-gray-500">Image: {imageFile.name}</p>}
        {docFile && <p className="text-sm text-gray-500">File: {docFile.name}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
                  <img src={profilePic || "https://via.placeholder.com/40"} alt="Profile" className="w-8 h-8 rounded-full object-cover"/>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex flex-col items-center">
                {/* Profile Picture */}
                <div className="relative w-24 h-24 mb-4">
                  <img src={profilePic || "https://via.placeholder.com/150"} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-600">
                      <span className="text-white text-lg font-bold">+</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        if(file){
                          setProfileFile(file);
                          const reader = new FileReader();
                          reader.onload = () => setProfilePic(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}/>
                    </label>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-amber-700">{user.name}</h2>

                {/* Location */}
                <div className="flex items-center mt-2 justify-center text-gray-600 text-sm">
                  {isEditing ? (
                    <>
                      <MapPin className="w-4 h-4 mr-1" />
                      <input type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-1 rounded w-48 text-sm text-center"/>
                    </>
                  ) : (
                    <span className="flex items-center justify-center text-gray-800 w-48"><MapPin className="w-4 h-4 mr-1" /> {location || "No location set"}</span>
                  )}
                </div>

                {/* Bio */}
                <div className="mt-2 flex items-start w-full px-4">
                  <div className="mr-2 mt-1"><FileText className="w-5 h-5 text-gray-500"/></div>
                  <div className="flex-1">
                    {isEditing ? (
                      <textarea placeholder="Enter bio" value={bio} onChange={(e) => setBio(e.target.value)} className="border p-1 rounded w-full text-sm"/>
                    ) : (
                      <p className="text-gray-800">{bio || "No bio added"}</p>
                    )}
                  </div>
                </div>

                {/* Interests */}
                <div className="mt-4 w-full px-4">
                  <h3 className="flex items-center gap-2 text-base font-serif text-black mb-2">
                    <Target className="w-4 h-4 text-black" /> Interests
                  </h3>
                  {isEditing ? (
                    <select multiple value={interests} onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setInterests(selected);
                    }} className="border p-2 rounded w-full text-sm h-32">
                      {interestOptions.map((interest, idx) => (<option key={idx} value={interest}>{interest}</option>))}
                    </select>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {interests.length > 0 ? (
                        interests.map((interest, idx) => (<span key={idx} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">{interest}</span>))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No interests added</p>
                      )}
                    </div>
                  )}
                  {isEditing && (<p className="text-xs text-gray-500 mt-1">Hold <b>Ctrl</b> (Windows) or <b>Cmd</b> (Mac) to select multiple.</p>)}
                </div>

                {/* Buttons */}
                {isEditing ? (
                  <div className="mt-4 flex space-x-2">
                    <button onClick={handleProfileUpdate} className="bg-amber-500 text-white px-4 py-2 rounded">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="mt-4 bg-amber-500 text-white px-4 py-2 rounded">Edit Profile</button>
                )}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex border-b border-gray-200">
                <button onClick={() => setActiveTab('posts')} className={`flex-1 px-6 py-4 text-center font-medium ${activeTab === 'posts' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-600'}`}>
                  <Users className="w-5 h-5 inline mr-2" /> Job Posts
                </button>
                <button onClick={() => setActiveTab('thoughts')} className={`flex-1 px-6 py-4 text-center font-medium ${activeTab === 'thoughts' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-600'}`}>
                  <MessageSquare className="w-5 h-5 inline mr-2" /> Personal Thoughts
                </button>
              </div>

              {/* Persistent Create Post Flow */}
              <CreatePostFlow type={activeTab === 'posts' ? 'job' : 'thought'} />

              {/* Posts / Thoughts Display */}
              <div className="space-y-4">
                {activeTab === 'posts'
                  ? posts.map((post) => (
                      <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                        {/* Header: Profile + Name */}
                        <div className="flex items-center mb-3">
                          <img
                            src={profilePic || 'https://via.placeholder.com/40'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <h3 className="text-gray-900 font-semibold">{user.name}</h3>
                            <p className="text-xs text-gray-500">Job Post</p>
                          </div>
                        </div>

                        {post.content && <p className="text-gray-700 mb-2">{post.content}</p>}
                        {post.image && (
                          <img
                            src={post.image}
                            alt="post"
                            className="mt-2 max-h-64 w-full object-cover rounded"
                          />
                        )}
                        {post.doc && (
                          <p className="mt-2 text-gray-500 flex items-center">
                            <Paperclip className="w-4 h-4 mr-1" /> {post.doc}
                          </p>
                        )}

                        {/* Bottom: Like & Share */}
                        <div className="flex items-center gap-6 mt-4 border-t pt-2">
                          <button className="flex items-center text-gray-600 hover:text-amber-600">
                            ❤️ Like
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-amber-600">
                            🔗 Share
                          </button>
                        </div>
                      </div>
                    ))
                  : thoughts.map((thought) => (
                      <div key={thought.id} className="bg-white rounded-lg shadow-sm p-6">
                        {/* Header: Profile + Name */}
                        <div className="flex items-center mb-3">
                          <img
                            src={profilePic || 'https://via.placeholder.com/40'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <h3 className="text-gray-900 font-semibold">{user.name}</h3>
                            <p className="text-xs text-gray-500">Personal Thought</p>
                          </div>
                        </div>

                        {thought.content && <p className="text-gray-700 mb-2">{thought.content}</p>}
                        {thought.image && (
                          <img
                            src={thought.image}
                            alt="thought"
                            className="mt-2 max-h-64 w-full object-cover rounded"
                          />
                        )}
                        {thought.doc && (
                          <p className="mt-2 text-gray-500 flex items-center">
                            <Paperclip className="w-4 h-4 mr-1" /> {thought.doc}
                          </p>
                        )}

                        {/* Bottom: Like & Share */}
                        <div className="flex items-center gap-6 mt-4 border-t pt-2">
                          <button className="flex items-center text-gray-600 hover:text-amber-600">
                            ❤️ Like
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-amber-600">
                            🔗 Share
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
