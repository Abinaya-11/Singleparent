import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = ({ notifications, setNotifications }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        unread: false,
      }))
    );
  };

  // Accept connection request
  const acceptConnection = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              subtitle: "Connection accepted ✅",
              unread: false,
              hasAction: false,
            }
          : n
      )
    );
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
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-sm text-amber-600 hover:underline"
        >
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
          <option value="connections">Connections</option>
          <option value="comments">Comments</option>
          <option value="likes">Likes</option>
          <option value="posts">Posts</option>
          <option value="events">Events</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredNotifications.length === 0 && (
          <p className="text-center text-gray-500">No notifications</p>
        )}
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-lg shadow bg-white transition ${
              n.unread ? "border-l-4 border-amber-500" : ""
            } w-full mx-auto`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-900">{n.title}</div>
                <div className="text-sm text-gray-600">{n.subtitle}</div>
                <div className="text-xs text-gray-400 mt-1">{n.time}</div>
              </div>
              {n.hasAction && (
                <button
                  onClick={() => acceptConnection(n.id)}
                  className="ml-4 px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600"
                >
                  Accept
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
