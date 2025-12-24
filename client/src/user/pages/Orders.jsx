import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function Orders() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 My Orders</h1>
        <Link to="/login" className="logout-btn">Logout</Link>
      </div>

      <div className="orders-list">
        <div className="order-card">
          <div className="order-header">
            <span className="order-id">#12345</span>
            <span className="order-status delivering">Delivering</span>
          </div>
          <div className="order-items">
            <p>🍕 Pizza x2, 🍔 Burger x1</p>
          </div>
          <div className="order-footer">
            <span className="order-total">₹847</span>
            <button className="track-btn">Track Order</button>
          </div>
        </div>

        <div className="order-card">
          <div className="order-header">
            <span className="order-id">#12344</span>
            <span className="order-status delivered">Delivered</span>
          </div>
          <div className="order-items">
            <p>🍜 Noodles x1, 🍰 Cake x1</p>
          </div>
          <div className="order-footer">
            <span className="order-total">₹448</span>
            <button className="reorder-btn">Reorder</button>
          </div>
        </div>

        <div className="order-card">
          <div className="order-header">
            <span className="order-id">#12343</span>
            <span className="order-status delivered">Delivered</span>
          </div>
          <div className="order-items">
            <p>🍕 Pizza x1</p>
          </div>
          <div className="order-footer">
            <span className="order-total">₹349</span>
            <button className="reorder-btn">Reorder</button>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/user" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/user/cart" className="nav-item">
          <span className="nav-icon">🛒</span>
          <span>Cart</span>
        </Link>
        <Link to="/user/orders" className="nav-item active">
          <span className="nav-icon">📦</span>
          <span>Orders</span>
        </Link>
        <Link to="/user/profile" className="nav-item">
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
