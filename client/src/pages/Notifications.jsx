import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const userId = localStorage.getItem("userId"); // logged-in user ID

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications/${userId}`);
        const formatted = await Promise.all(res.data.map(async (n) => {
          let connectionId = null;
          let senderId = n.caregiver;
          let senderName = "Someone";
          
          // For connection requests, get the connection ID and sender info
          if (n.type === "connection" && n.message.includes("wants to connect") && senderId) {
            try {
              const token = localStorage.getItem("userToken");
              const config = { headers: { Authorization: `Bearer ${token}` } };
              const statusRes = await axios.get(`/api/connections/status/${senderId}`, config);
              connectionId = statusRes.data.connectionId;
              
              // Get sender name from user API
              const userRes = await axios.get(`/api/user/profile`, config);
              senderName = n.message.split(" wants to connect")[0] || "Someone";
            } catch (err) {
              console.error("Error getting connection details:", err);
            }
          }
          
          return {
            id: n._id,
            title: n.message,
            subtitle: "",
            time: new Date(n.createdAt).toLocaleString(),
            unread: !n.read,
            hasAction: n.type === "connection" && n.message.includes("wants to connect"),
            type: n.type,
            senderId,
            senderName,
            connectionId
          };
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          axios.put(`/api/notifications/read/${n.id}`)
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle connection accept
  const handleAcceptConnection = async (notificationId, connectionId, senderId, senderName) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Accept the connection using the connection API
      await axios.put(`/api/connections/accept/${connectionId}`, {}, config);

      // Mark current notification as read
      await axios.put(`/api/notifications/read/${notificationId}`);

      // Update local notifications
      setNotifications(prev => prev.map(n => 
        n.id === notificationId 
          ? { ...n, unread: false, hasAction: false, title: `Connected with ${senderName}` }
          : n
      ));

      // Call Main page's connection handler if available
      if (window.handleConnectionAccept) {
        window.handleConnectionAccept(connectionId, senderId, senderName);
      }
    } catch (err) {
      console.error("Error accepting connection:", err);
    }
  };

  // Handle connection decline
  const handleDeclineConnection = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/read/${notificationId}`);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId 
          ? { ...n, unread: false, hasAction: false, title: "Connection request declined" }
          : n
      ));
    } catch (err) {
      console.error("Error declining connection:", err);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.unread;
    return n.type === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-indigo-600 font-medium">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
        </div>
        <button onClick={markAllAsRead} className="text-sm text-amber-600 hover:underline">
          Mark all as read
        </button>
      </header>

      {/* Filter */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-gray-700"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredNotifications.length === 0 && <p className="text-center text-gray-500">No notifications</p>}
        {filteredNotifications.map((n) => (
          <div key={n.id} className={`p-4 rounded-lg shadow bg-white transition ${n.unread ? "border-l-4 border-amber-500" : ""} w-full mx-auto`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{n.title}</div>
                <div className="text-xs text-gray-400 mt-1">{n.time}</div>
              </div>
              {n.hasAction && n.unread && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleAcceptConnection(n.id, n.connectionId, n.senderId, n.senderName)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    disabled={!n.connectionId}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineConnection(n.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
