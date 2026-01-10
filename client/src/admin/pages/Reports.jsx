import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/reports.css';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Reports() {
  const stats = useQuery(api.modules.orders.orders.getOrderStatistics) || {
    totalOrders: 0,
    totalRevenue: 0,
    totalDeliveries: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  };

  const allOrders = useQuery(api.modules.orders.orders.getAllOrders) || [];

  // Helper to aggregate data for charts (Last 7 days)
  const getChartData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      return { date: dateStr, orders: 0, revenue: 0 };
    }).reverse();

    allOrders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const dayStat = last7Days.find(d => d.date === orderDate);
      if (dayStat) {
        dayStat.orders += 1;
        if (order.status === 'delivered') {
          dayStat.revenue += order.totalAmount;
        }
      }
    });

    // Format date for display
    return last7Days.map(d => ({
      ...d,
      date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
    }));
  };

  const chartData = getChartData();

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>📈 Business Reports</h1>
          <p style={{ color: '#666' }}>Overview of business performance.</p>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orders">📦</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon delivered">✅</div>
            <div className="stat-info">
              <h3>Delivered</h3>
              <p className="stat-value">{stats.deliveredOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cancelled">❌</div>
            <div className="stat-info">
              <h3>Cancelled</h3>
              <p className="stat-value">{stats.cancelledOrders}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-container">
          <div className="chart-card">
            <h3>Sales Trend (Last 7 Days)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Orders Overview</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#82ca9d" name="Orders Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
