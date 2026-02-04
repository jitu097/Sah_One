import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="delivery-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src="/LOGO.png" alt="Logo" className="navbar-logo" />
          <span className="brand-text">Delivery Partner</span>
        </div>

        <div className="navbar-links">
          <Link to="/delivery?tab=assigned" className={`nav-link ${isActive('/delivery') && (location.search.includes('tab=assigned') || !location.search) ? 'active' : ''}`}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Assigned</span>
          </Link>
          <Link to="/delivery?tab=ongoing" className={`nav-link ${location.search.includes('tab=ongoing') ? 'active' : ''}`}>
            <span className="nav-icon">🚲</span>
            <span className="nav-text">Ongoing</span>
          </Link>
          <Link to="/delivery?tab=history" className={`nav-link ${location.search.includes('tab=history') ? 'active' : ''}`}>
            <span className="nav-icon">📜</span>
            <span className="nav-text">History</span>
          </Link>
        </div>

        <div className="navbar-actions">
          {/* Profile Link (reusing nav-link style for consistency, or adding a specific profile class) */}
          <Link to="/delivery/profile" className="nav-link profile-link">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
