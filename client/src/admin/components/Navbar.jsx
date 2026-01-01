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
    <nav className="admin-navbar">
      <div className="admin-nav-left">
        <img src="/LOGO.png" alt="SAH_ONE Admin" className="admin-logo" />
        <span className="admin-badge">Admin Panel</span>
      </div>

      <div className="admin-nav-center">
        <Link to="/admin" className={`admin-nav-link ${isActive('/admin')}`}>
          Dashboard
        </Link>
        <Link to="/admin/menu" className={`admin-nav-link ${isActive('/admin/menu')}`}>
          Menu
        </Link>
        <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
          Orders
        </Link>
        <Link to="/admin/offers" className={`admin-nav-link ${isActive('/admin/offers')}`}>
          Offers
        </Link>
        <Link to="/admin/reports" className={`admin-nav-link ${isActive('/admin/reports')}`}>
          Reports
        </Link>
      </div>

      <div className="admin-nav-right">
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
