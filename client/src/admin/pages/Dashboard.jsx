import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

// Demo customer data (will be replaced with real data from DB)
const DEMO_CUSTOMERS = [
  { id: 1, name: 'Rahul Kumar', phone: '+91 98765 43210', orders: 15, totalSpent: 4500, lastOrder: '2 days ago' },
  { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', orders: 8, totalSpent: 2800, lastOrder: '1 day ago' },
  { id: 3, name: 'Amit Patel', phone: '+91 98765 43212', orders: 12, totalSpent: 3600, lastOrder: '3 days ago' },
  { id: 4, name: 'Sneha Gupta', phone: '+91 98765 43213', orders: 20, totalSpent: 6200, lastOrder: 'Today' },
  { id: 5, name: 'Vikram Singh', phone: '+91 98765 43214', orders: 5, totalSpent: 1500, lastOrder: '5 days ago' },
  { id: 6, name: 'Anjali Verma', phone: '+91 98765 43215', orders: 18, totalSpent: 5400, lastOrder: '1 day ago' },
  { id: 7, name: 'Rajesh Yadav', phone: '+91 98765 43216', orders: 9, totalSpent: 2700, lastOrder: '4 days ago' },
  { id: 8, name: 'Kavita Singh', phone: '+91 98765 43217', orders: 14, totalSpent: 4200, lastOrder: 'Today' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showCustomersModal, setShowCustomersModal] = useState(false);

  // Handle stat card clicks - redirect to appropriate pages
  const handleTotalOrdersClick = () => {
    navigate('/admin/orders');
  };

  const handleRevenueClick = () => {
    navigate('/admin/reports');
  };

  const handleCustomersClick = () => {
    setShowCustomersModal(true);
  };

  const handleMenuItemsClick = () => {
    navigate('/admin/menu');
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🔧 Admin Dashboard</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid - All clickable */}
        <div className="stats-grid">
          <div className="stat-card clickable" onClick={handleTotalOrdersClick} title="Click to view all orders">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-value">1,234</p>
              <span className="stat-hint">View Orders →</span>
            </div>
          </div>

          <div className="stat-card clickable" onClick={handleRevenueClick} title="Click to view revenue reports">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Revenue</h3>
              <p className="stat-value">₹45,678</p>
              <span className="stat-hint">View Reports →</span>
            </div>
          </div>

          <div className="stat-card clickable" onClick={handleCustomersClick} title="Click to view customer list">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Customers</h3>
              <p className="stat-value">567</p>
              <span className="stat-hint">View List →</span>
            </div>
          </div>

          <div className="stat-card clickable" onClick={handleMenuItemsClick} title="Click to manage menu">
            <div className="stat-icon">🍽️</div>
            <div className="stat-info">
              <h3>Menu Items</h3>
              <p className="stat-value">89</p>
              <span className="stat-hint">Manage Menu →</span>
            </div>
          </div>
        </div>

        {/* Quick Actions - All redirect to respective pages */}
        <div className="admin-actions">
          <Link to="/admin/menu" className="action-card">
            <span className="action-icon">🍽️</span>
            <h3>Manage Menu</h3>
            <p>Add, edit, or remove menu items</p>
          </Link>
          
          <Link to="/admin/orders" className="action-card">
            <span className="action-icon">📦</span>
            <h3>View Orders</h3>
            <p>Track and manage customer orders</p>
          </Link>
          
          <Link to="/admin/offers" className="action-card">
            <span className="action-icon">🎁</span>
            <h3>Manage Offers</h3>
            <p>Create and manage promotional offers</p>
          </Link>
          
          <Link to="/admin/reports" className="action-card">
            <span className="action-icon">📈</span>
            <h3>View Reports</h3>
            <p>Analyze sales and performance data</p>
          </Link>
        </div>

        {/* Customers Modal - Shows list of customers */}
        {showCustomersModal && (
          <div className="modal-overlay" onClick={() => setShowCustomersModal(false)}>
            <div className="modal-content customers-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>👥 Customer List</h2>
                <button className="modal-close" onClick={() => setShowCustomersModal(false)}>×</button>
              </div>

              <div className="modal-body">
                <div className="customers-stats">
                  <div className="customer-stat-item">
                    <span className="label">Total Customers:</span>
                    <span className="value">{DEMO_CUSTOMERS.length}</span>
                  </div>
                  <div className="customer-stat-item">
                    <span className="label">Total Orders:</span>
                    <span className="value">{DEMO_CUSTOMERS.reduce((sum, c) => sum + c.orders, 0)}</span>
                  </div>
                  <div className="customer-stat-item">
                    <span className="label">Total Revenue:</span>
                    <span className="value">₹{DEMO_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="customers-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Phone</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                        <th>Last Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_CUSTOMERS.map(customer => (
                        <tr key={customer.id}>
                          <td>
                            <div className="customer-name">
                              <span className="avatar">{customer.name.charAt(0)}</span>
                              <strong>{customer.name}</strong>
                            </div>
                          </td>
                          <td>{customer.phone}</td>
                          <td>
                            <span className="badge orders-badge">{customer.orders} orders</span>
                          </td>
                          <td>
                            <strong style={{ color: '#2ecc71' }}>₹{customer.totalSpent.toLocaleString()}</strong>
                          </td>
                          <td>
                            <span className="last-order">{customer.lastOrder}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer">
                <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>
                  💡 This is demo data. Connect to database to see real customer information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
