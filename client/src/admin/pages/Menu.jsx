import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Menu() {
  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🍽️ Manage Menu</h1>
        </div>

      <button className="add-item-btn">+ Add New Item</button>

      <div className="admin-list">
        <div className="admin-item">
          <span className="item-emoji">🍕</span>
          <div className="item-details">
            <h3>Pizza</h3>
            <p>Cheese pizza</p>
            <span className="item-price">₹299</span>
          </div>
          <div className="item-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>

        <div className="admin-item">
          <span className="item-emoji">🍔</span>
          <div className="item-details">
            <h3>Burger</h3>
            <p>Beef burger</p>
            <span className="item-price">₹199</span>
          </div>
          <div className="item-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
