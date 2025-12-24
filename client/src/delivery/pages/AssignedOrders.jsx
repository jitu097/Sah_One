import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function AssignedOrders() {
  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h1>🚗 Assigned Orders</h1>
        <Link to="/login" className="logout-btn">Logout</Link>
      </div>

      <div className="delivery-list">
        <div className="delivery-card">
          <div className="order-info">
            <h3>Order #12345</h3>
            <p className="restaurant">🏪 Pizza Palace</p>
            <p className="customer">👤 John Doe</p>
            <p className="address">📍 123 Main St, City</p>
          </div>
          <div className="order-actions">
            <Link to="/delivery/pickup" className="btn-pickup">Pickup</Link>
          </div>
        </div>

        <div className="delivery-card">
          <div className="order-info">
            <h3>Order #12346</h3>
            <p className="restaurant">🏪 Burger House</p>
            <p className="customer">👤 Jane Smith</p>
            <p className="address">📍 456 Oak Ave, City</p>
          </div>
          <div className="order-actions">
            <Link to="/delivery/pickup" className="btn-pickup">Pickup</Link>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/delivery" className="nav-item active">
          <span className="nav-icon">📦</span>
          <span>Orders</span>
        </Link>
        <Link to="/delivery/pickup" className="nav-item">
          <span className="nav-icon">🏪</span>
          <span>Pickup</span>
        </Link>
        <Link to="/delivery/confirm" className="nav-item">
          <span className="nav-icon">✅</span>
          <span>Confirm</span>
        </Link>
      </nav>
    </div>
  );
}
