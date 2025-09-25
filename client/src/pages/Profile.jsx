import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading spinner
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f8f9fa; color:#333; }
        .container { max-width:900px; margin:0 auto; background:white; min-height:100vh; }

        /* Header */
        .header { display:flex; justify-content:space-between; align-items:center; padding:20px 40px; border-bottom:1px solid #e9ecef; }
        .logo { color:#6366f1; font-size:24px; font-weight:600; display:flex; align-items:center; }
        .logo::before { content:"✱"; margin-right:10px; font-size:28px; }
        .nav-menu { display:flex; list-style:none; gap:30px; }
        .nav-menu li { color:#6c757d; cursor:pointer; font-size:14px; font-weight:500; }
        .nav-menu li:hover { color:#6366f1; }
        .nav-menu li.active { color:#333; }
        .auth-buttons { display:flex; gap:10px; }
        .btn-login, .btn-register { padding:8px 16px; border:none; border-radius:6px; font-size:14px; font-weight:500; cursor:pointer; }
        .btn-login { background:#6366f1; color:white; }
        .btn-register { background:#6c5ce7; color:white; }

        /* Profile Section */
        .profile-section { background:#f8f9fa; padding:40px; display:flex; align-items:center; gap:30px; position:relative; }
        .profile-avatar { width:120px; height:120px; border-radius:50%; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:48px; font-weight:600; position:relative; z-index:2; }
        .profile-info { flex:1; z-index:2; }
        .profile-name { font-size:28px; font-weight:700; color:#333; margin-bottom:5px; }
        .profile-title { color:#6c757d; font-size:16px; margin-bottom:5px; }
        .profile-location { color:#6c757d; font-size:14px; margin-bottom:20px; }
        .profile-buttons { display:flex; gap:15px; align-items:center; }
        .btn-connect { background:#6366f1; color:white; padding:10px 20px; border:none; border-radius:6px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:5px; }
        .btn-icon { background:white; border:1px solid #dee2e6; padding:10px 12px; border-radius:6px; cursor:pointer; color:#6c757d; font-size:14px; }

        /* Stats Section */
        .stats-section { display:flex; justify-content:space-around; padding:30px 40px; border-bottom:1px solid #e9ecef; }
        .stat-item { text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; }
        .stat-icon { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:5px; }
        .connections-icon { background:#e3f2fd; color:#1976d2; }
        .groups-icon { background:#f3e5f5; color:#7b1fa2; }
        .posts-icon { background:#fff3e0; color:#f57c00; }
        .events-icon { background:#e8f5e8; color:#388e3c; }
        .stat-number { font-size:24px; font-weight:700; color:#333; }
        .stat-label { color:#6c757d; font-size:14px; font-weight:500; }

        /* About Section */
        .about-section { padding:40px; }
        .section-title { font-size:20px; font-weight:600; color:#333; margin-bottom:20px; }
        .subsection { margin-bottom:25px; }
        .subsection-title { font-size:16px; font-weight:600; color:#333; margin-bottom:8px; }
        .subsection-content { color:#6c757d; font-size:14px; line-height:1.5; }

        /* Community Highlights */
        .community-highlights { background:#f8f9fa; padding:40px; }
        .highlights-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:30px; margin-top:20px; }
        .highlight-card { background:white; padding:20px; border-radius:8px; border:1px solid #e9ecef; transition:all 0.3s ease; }
        .highlight-card:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.1); }
        .highlight-icon { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; margin-bottom:15px; }
        .highlight-title { font-size:16px; font-weight:600; color:#333; margin-bottom:8px; }
        .highlight-description { color:#6c757d; font-size:14px; line-height:1.4; margin-bottom:15px; }
        .highlight-meta { display:flex; align-items:center; gap:10px; font-size:12px; color:#6c757d; }
        .highlight-tag { background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px; }
        .icon-pink { background:#fce4ec; color:#e91e63; }
        .icon-purple { background:#f3e5f5; color:#9c27b0; }
        .icon-orange { background:#fff3e0; color:#ff9800; }
        .icon-blue { background:#e3f2fd; color:#2196f3; }
        .icon-green { background:#e8f5e8; color:#4caf50; }

        /* Footer */
        .footer { display:flex; justify-content:space-between; align-items:center; padding:30px 40px; border-top:1px solid #e9ecef; }
        .footer-links { display:flex; gap:20px; }
        .footer-links a { color:#6c757d; text-decoration:none; font-size:14px; }
        .footer-links a:hover { color:#333; }
        .social-icons { display:flex; gap:15px; }
        .social-icon { width:32px; height:32px; border-radius:50%; background:#f8f9fa; display:flex; align-items:center; justify-content:center; color:#6c757d; text-decoration:none; font-size:16px; }
        .social-icon:hover { background:#6366f1; color:white; }

        /* Loading spinner */
        .loading-spinner { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:80px; height:80px; z-index:5; }
        .spinner { width:80px; height:80px; border:3px solid #e9ecef; border-top:3px solid #6366f1; border-radius:50%; animation:spin 1s linear infinite; }
        @keyframes spin { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }

        /* Responsive */
        @media(max-width:768px){
          .header{ padding:15px 20px; }
          .nav-menu{ gap:15px; }
          .profile-section{ padding:30px 20px; flex-direction:column; text-align:center; }
          .stats-section{ padding:20px; }
          .highlights-grid{ grid-template-columns:1fr; gap:20px; }
          .about-section, .community-highlights{ padding:30px 20px; }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="logo">FamilyConnect - Homepage</div>
        <nav>
          <ul className="nav-menu">
            <li className="active">Home</li>
            <li>Explore</li>
            <li>Community</li>
            <li>Resources</li>
            <li>About Us</li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="btn-login">Notification</button>
          <button className="btn-register">Profile</button>
        </div>
      </header>

      {/* Profile Section */}
      <section className="profile-section">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        <div className="profile-avatar">SL</div>
        <div className="profile-info">
          <h1 className="profile-name">Sarah L.</h1>
          <p className="profile-title">Single Parent | Community Builder | Seeking Support & Opportunities</p>
          <p className="profile-location">New York, USA</p>
          <div className="profile-buttons">
            <button className="btn-connect" onClick={() => alert('Connection request sent!')}>🔗 Connect</button>
            <button className="btn-icon" onClick={() => alert('Opening message composer...')}>✉️ Message</button>
            <button className="btn-icon">👤 Follow</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <div className="stat-icon connections-icon">👥</div>
          <div className="stat-number">160</div>
          <div className="stat-label">Connections</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon groups-icon">🏛️</div>
          <div className="stat-number">6</div>
          <div className="stat-label">Groups</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon posts-icon">📝</div>
          <div className="stat-number">46</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon events-icon">📅</div>
          <div className="stat-number">12</div>
          <div className="stat-label">Events</div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="section-title">About</h2>
        <div className="subsection">
          <h3 className="subsection-title">Bio</h3>
          <p className="subsection-content">
            Sarah is a passionate single mother of two, dedicated to building a supportive network for parents in her community. She believes in the power of shared experiences and mutual encouragement to navigate the journey of parenthood.
          </p>
        </div>
        <div className="subsection">
          <h3 className="subsection-title">Personal Story</h3>
          <p className="subsection-content">
            After becoming a single parent, I found strength and inspiration in connecting with others facing similar challenges. OneConnect became my safe haven, helping me realize I wasn't alone. Now, I strive to offer that same support and understanding to new members, fostering a vibrant and inclusive community.
          </p>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="community-highlights">
        <h2 className="section-title">Community Highlights</h2>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon icon-pink">👑</div>
            <h3 className="highlight-title">Single Moms United</h3>
            <p className="highlight-description">A platform for single mothers to share advice, resources, and emotional support.</p>
            <div className="highlight-meta">
              <span className="highlight-tag">Sarah</span>
            </div>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon icon-purple">🤝</div>
            <h3 className="highlight-title">Co-Parenting Support Network</h3>
            <p className="highlight-description">Dedicated to fostering healthy co-parenting relationships and providing helpful resources to understand and deal with divorce, legal regulations, and stress.</p>
            <div className="highlight-meta">
              <span className="highlight-tag">Sarah</span>
              <span className="highlight-tag">Level 2</span>
            </div>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon icon-orange">🎒</div>
            <h3 className="highlight-title">Local Family Adventures</h3>
            <p className="highlight-description">Organize family-friendly outings and activities to help new families explore their community with children.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Product</a>
          <a href="#">Resources</a>
          <a href="#">Company</a>
        </div>
        <div className="social-icons">
          <a href="#" className="social-icon">📘</a>
          <a href="#" className="social-icon">🐦</a>
          <a href="#" className="social-icon">📷</a>
          <a href="#" className="social-icon">💼</a>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
