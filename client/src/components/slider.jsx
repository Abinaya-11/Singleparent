import React, { useRef } from "react";
import "./slider.css";   // ✅ this line is correct — keeps styles with component

const ProfileCard = ({ user }) => (
  <div className="sp-card">
    <img
      className="sp-avatar"
      src={user.profilePic || "/default-avatar.png"}
      alt={user.name}
    />
    <div className="sp-name">{user.name}</div>
  </div>
);

export default function SuggestionsSlider({ users = [] }) {
  const containerRef = useRef(null);
  const displayedUsers = users.slice(0, 8);

  const scroll = (dir = 1) => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.clientWidth * 0.7;
    containerRef.current.scrollBy({
      left: dir * scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="sp-wrapper">
      <button className="sp-arrow left" onClick={() => scroll(-1)}>‹</button>

      <div className="sp-slider" ref={containerRef}>
        {displayedUsers.map((u) => (
          <ProfileCard key={u._id || u.id} user={u} />
        ))}
      </div>

      <button className="sp-arrow right" onClick={() => scroll(1)}>›</button>
    </div>
  );
}
