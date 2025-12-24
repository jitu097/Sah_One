import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>👤 Profile</h1>
        </div>

      <div className="profile-section">
        <div className="profile-avatar">👤</div>
        <h2>John Doe</h2>
        <p className="profile-email">user@test.com</p>
      </div>

      <div className="profile-options">
        <div className="option-item">
          <span className="option-icon">📍</span>
          <div>
            <h3>Delivery Address</h3>
            <p>123 Main St, City, State 12345</p>
          </div>
        </div>

        <div className="option-item">
          <span className="option-icon">📱</span>
          <div>
            <h3>Phone Number</h3>
            <p>+1 234 567 8900</p>
          </div>
        </div>

        <div className="option-item">
          <span className="option-icon">💳</span>
          <div>
            <h3>Payment Methods</h3>
            <p>**** **** **** 1234</p>
          </div>
        </div>

        <div className="option-item">
          <span className="option-icon">⚙️</span>
          <div>
            <h3>Settings</h3>
            <p>Manage your preferences</p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
