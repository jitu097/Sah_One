import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function Orders() {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📦 All Orders</h1>
        <Link to="/admin" className="back-btn">← Back</Link>
      </div>

      <div className="admin-list">
        <div className="admin-item">
          <div className="item-details">
            <h3>Order #12345</h3>
            <p>John Doe - 2 items</p>
            <span className="order-badge pending">Pending</span>
          </div>
          <span className="item-price">₹847</span>
        </div>

        <div className="admin-item">
          <div className="item-details">
            <h3>Order #12344</h3>
            <p>Jane Smith - 1 item</p>
            <span className="order-badge completed">Completed</span>
          </div>
          <span className="item-price">₹299</span>
        </div>
      </div>
    </div>
  );
}
