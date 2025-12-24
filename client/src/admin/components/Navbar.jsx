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
    <nav className="admin-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Logo size="small" showText={false} />
          <span className="brand-text">Admin Panel</span>
        </div>

        <div className="navbar-links">
          <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/admin/menu" className={`nav-link ${isActive('/admin/menu')}`}>
            <span className="nav-icon">🍽️</span>
            <span className="nav-text">Menu</span>
          </Link>
          <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders')}`}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Orders</span>
          </Link>
          <Link to="/admin/offers" className={`nav-link ${isActive('/admin/offers')}`}>
            <span className="nav-icon">🎁</span>
            <span className="nav-text">Offers</span>
          </Link>
          <Link to="/admin/reports" className={`nav-link ${isActive('/admin/reports')}`}>
            <span className="nav-icon">📈</span>
            <span className="nav-text">Reports</span>
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
