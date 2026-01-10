import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function Dashboard() {
  const stats = useQuery(api.modules.orders.orders.getOrderStatistics) || {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    preparingOrders: 0,
    outForDelivery: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  };

  const recentOrders = useQuery(api.modules.orders.orders.getRecentOrders) || [];

  const activeOrdersCount = (stats.pendingOrders || 0) + (stats.confirmedOrders || 0) + (stats.preparingOrders || 0) + (stats.outForDelivery || 0);

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="dashboard-header">
          <h1>👋 Welcome, Admin</h1>
          <p>Here's what's happening today.</p>
        </div>

        {/* Quick Stats Row */}
        <div className="stats-row">
          <div className="dashboard-card stat">
            <div className="icon">💰</div>
            <div className="info">
              <h3>Total Revenue</h3>
              <p>₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="dashboard-card stat">
            <div className="icon">🥡</div>
            <div className="info">
              <h3>Active Orders</h3>
              <p>{activeOrdersCount}</p>
            </div>
          </div>
          <div className="dashboard-card stat">
            <div className="icon">✅</div>
            <div className="info">
              <h3>Completed</h3>
              <p>{stats.deliveredOrders}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders Panel */}
          <div className="dashboard-panel recent-orders">
            <div className="panel-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders">View All</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="4">No recent orders</td></tr>
                ) : (
                  recentOrders.slice(0, 5).map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.substring(0, 8)}...</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>₹{order.totalAmount}</td>
                      <td>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Actions Panel */}
          <div className="dashboard-panel quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/admin/menu" className="action-card">
                <span className="icon">🍔</span>
                <span>Manage Menu</span>
              </Link>
              <Link to="/admin/orders" className="action-card">
                <span className="icon">📦</span>
                <span>View Orders</span>
              </Link>
              <Link to="/admin/offers" className="action-card">
                <span className="icon">🏷️</span>
                <span>Create Offer</span>
              </Link>
              <Link to="/admin/reports" className="action-card">
                <span className="icon">📈</span>
                <span>View Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
