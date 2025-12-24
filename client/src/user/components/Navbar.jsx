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
    <nav className="user-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Logo size="small" showText={false} />
          <span className="brand-text">Sah One</span>
        </div>

        <div className="navbar-links">
          <Link to="/user" className={`nav-link ${isActive('/user')}`}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          <Link to="/user/cart" className={`nav-link ${isActive('/user/cart')}`}>
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Cart</span>
          </Link>
          <Link to="/user/orders" className={`nav-link ${isActive('/user/orders')}`}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Orders</span>
          </Link>
          <Link to="/user/profile" className={`nav-link ${isActive('/user/profile')}`}>
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
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
