import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function Pickup() {
  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h1>🏪 Pickup Orders</h1>
        <Link to="/login" className="logout-btn">Logout</Link>
      </div>

      <div className="pickup-details">
        <div className="detail-card">
          <h3>Order #12345</h3>
          <div className="detail-row">
            <span className="label">Restaurant:</span>
            <span className="value">🏪 Pizza Palace</span>
          </div>
          <div className="detail-row">
            <span className="label">Items:</span>
            <span className="value">2 Pizzas, 1 Burger</span>
          </div>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value">₹847</span>
          </div>
          <button className="btn-confirm-pickup">Confirm Pickup</button>
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/delivery" className="nav-item">
          <span className="nav-icon">📦</span>
          <span>Orders</span>
        </Link>
        <Link to="/delivery/pickup" className="nav-item active">
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
