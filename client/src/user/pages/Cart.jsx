import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function Cart() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🛒 My Cart</h1>
        <Link to="/login" className="logout-btn">Logout</Link>
      </div>

      <div className="cart-items">
        <div className="cart-item">
          <div className="item-info">
            <span className="item-icon">🍕</span>
            <div>
              <h3>Pizza</h3>
              <p>Cheese pizza</p>
            </div>
          </div>
          <div className="item-actions">
            <button className="qty-btn">-</button>
            <span className="qty">2</span>
            <button className="qty-btn">+</button>
            <span className="item-price">₹598</span>
          </div>
        </div>

        <div className="cart-item">
          <div className="item-info">
            <span className="item-icon">🍔</span>
            <div>
              <h3>Burger</h3>
              <p>Beef burger</p>
            </div>
          </div>
          <div className="item-actions">
            <button className="qty-btn">-</button>
            <span className="qty">1</span>
            <button className="qty-btn">+</button>
            <span className="item-price">₹199</span>
          </div>
        </div>
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹797</span>
        </div>
        <div className="summary-row">
          <span>Delivery:</span>
          <span>₹50</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>₹847</span>
        </div>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>

      <nav className="bottom-nav">
        <Link to="/user" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/user/cart" className="nav-item active">
          <span className="nav-icon">🛒</span>
          <span>Cart</span>
        </Link>
        <Link to="/user/orders" className="nav-item">
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
