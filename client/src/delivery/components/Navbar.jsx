import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../shared/components/Logo';
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
          <Logo size="small" showText={false} />
          <span className="brand-text">Delivery Partner</span>
        </div>

        <div className="navbar-links">
          <Link to="/delivery" className={`nav-link ${isActive('/delivery')}`}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Assigned</span>
          </Link>
          <Link to="/delivery/pickup" className={`nav-link ${isActive('/delivery/pickup')}`}>
            <span className="nav-icon">📍</span>
            <span className="nav-text">Pickup</span>
          </Link>
          <Link to="/delivery/confirm" className={`nav-link ${isActive('/delivery/confirm')}`}>
            <span className="nav-icon">✅</span>
            <span className="nav-text">Confirm</span>
          </Link>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </nav>
  );
}
