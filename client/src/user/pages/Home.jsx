import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function Home() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🍕 Browse Menu</h1>
        <Link to="/login" className="logout-btn">Logout</Link>
      </div>

      <div className="menu-grid">
        <div className="menu-item">
          <div className="item-image">🍕</div>
          <h3>Pizza</h3>
          <p>Delicious cheese pizza</p>
          <div className="item-footer">
            <span className="price">₹299</span>
            <button className="add-btn">Add to Cart</button>
          </div>
        </div>

        <div className="menu-item">
          <div className="item-image">🍔</div>
          <h3>Burger</h3>
          <p>Juicy beef burger</p>
          <div className="item-footer">
            <span className="price">₹199</span>
            <button className="add-btn">Add to Cart</button>
          </div>
        </div>

        <div className="menu-item">
          <div className="item-image">🍜</div>
          <h3>Noodles</h3>
          <p>Hot spicy noodles</p>
          <div className="item-footer">
            <span className="price">₹149</span>
            <button className="add-btn">Add to Cart</button>
          </div>
        </div>

        <div className="menu-item">
          <div className="item-image">🍰</div>
          <h3>Cake</h3>
          <p>Chocolate cake</p>
          <div className="item-footer">
            <span className="price">₹249</span>
            <button className="add-btn">Add to Cart</button>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/user" className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/user/cart" className="nav-item">
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
