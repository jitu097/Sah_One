import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function Reports() {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📈 Reports</h1>
        <Link to="/admin" className="back-btn">← Back</Link>
      </div>

      <div className="report-cards">
        <div className="report-card">
          <h3>Daily Sales</h3>
          <p className="report-value">₹12,345</p>
          <span className="report-change positive">+12%</span>
        </div>

        <div className="report-card">
          <h3>Weekly Sales</h3>
          <p className="report-value">₹78,900</p>
          <span className="report-change positive">+8%</span>
        </div>

        <div className="report-card">
          <h3>Monthly Sales</h3>
          <p className="report-value">₹3,45,678</p>
          <span className="report-change negative">-3%</span>
        </div>
      </div>
    </div>
  );
}
