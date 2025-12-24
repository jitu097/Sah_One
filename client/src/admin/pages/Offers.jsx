import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Offers() {
  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🎁 Manage Offers</h1>
        </div>

      <button className="add-item-btn">+ Create New Offer</button>

      <div className="admin-list">
        <div className="admin-item">
          <div className="item-details">
            <h3>50% OFF</h3>
            <p>On first order</p>
            <span className="offer-code">CODE: FIRST50</span>
          </div>
          <button className="edit-btn">Edit</button>
        </div>

        <div className="admin-item">
          <div className="item-details">
            <h3>Free Delivery</h3>
            <p>Orders above ₹500</p>
            <span className="offer-code">CODE: FREEDEL</span>
          </div>
          <button className="edit-btn">Edit</button>
        </div>
      </div>
      </div>
    </>
  );
}
