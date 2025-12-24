import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function DeliveryConfirm() {
  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h1>✅ Confirm Delivery</h1>
        <Link to="/login" className="logout-btn">Logout</Link>
      </div>

      <div className="confirm-details">
        <div className="detail-card">
          <h3>Order #12345</h3>
          <div className="detail-row">
            <span className="label">Customer:</span>
            <span className="value">👤 John Doe</span>
          </div>
          <div className="detail-row">
            <span className="label">Address:</span>
            <span className="value">📍 123 Main St, City</span>
          </div>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value">₹847</span>
          </div>
          <div className="detail-row">
            <span className="label">Payment:</span>
            <span className="value">💳 Online Paid</span>
          </div>
          <button className="btn-complete-delivery">Complete Delivery</button>
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/delivery" className="nav-item">
          <span className="nav-icon">📦</span>
          <span>Orders</span>
        </Link>
        <Link to="/delivery/pickup" className="nav-item">
          <span className="nav-icon">🏪</span>
          <span>Pickup</span>
        </Link>
        <Link to="/delivery/confirm" className="nav-item active">
          <span className="nav-icon">✅</span>
          <span>Confirm</span>
        </Link>
      </nav>
    </div>
  );
}
