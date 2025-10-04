import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/Main";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

function App() {
  // ✅ Shared notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "connections",
      title: "Connection Request",
      subtitle: "Sarah L. wants to connect with you.",
      time: "2m ago",
      unread: true,
      hasAction: true,
    },
    {
      id: 2,
      type: "likes",
      title: "Someone liked your post",
      subtitle: "Mark S. liked your parenting story.",
      time: "10m ago",
      unread: true,
    },
    {
      id: 3,
      type: "comments",
      title: "New Comment",
      subtitle: "Jessica A. commented: 'This really helped me!'",
      time: "30m ago",
      unread: false,
    },
    {
      id: 4,
      type: "posts",
      title: "New Post",
      subtitle: "Tom K. posted a new post.",
      time: "1h ago",
      unread: true,
    },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ✅ Pass notifications state as props */}
        <Route 
          path="/main" 
          element={<MainPage notifications={notifications} setNotifications={setNotifications} />} 
        />
        <Route path="/profile" element={<Profile />} />
        <Route 
          path="/notifications" 
          element={<Notifications notifications={notifications} setNotifications={setNotifications} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
