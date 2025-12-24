import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🔧 Admin Dashboard</h1>
        </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">1,234</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p className="stat-value">₹45,678</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Customers</h3>
            <p className="stat-value">567</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <h3>Menu Items</h3>
            <p className="stat-value">89</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/menu" className="action-card">
          <span className="action-icon">🍽️</span>
          <h3>Manage Menu</h3>
        </Link>
        <Link to="/admin/orders" className="action-card">
          <span className="action-icon">📦</span>
          <h3>View Orders</h3>
        </Link>
        <Link to="/admin/offers" className="action-card">
          <span className="action-icon">🎁</span>
          <h3>Manage Offers</h3>
        </Link>
        <Link to="/admin/reports" className="action-card">
          <span className="action-icon">📈</span>
          <h3>View Reports</h3>
        </Link>
      </div>
      </div>
    </>
  );
}
