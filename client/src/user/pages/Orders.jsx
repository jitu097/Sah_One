import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import '../styles/Orders.css';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function Orders() {
  const { currentUser } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const userProfile = useQuery(api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  const orders = useQuery(api.modules.orders.orders.getOrdersByUserId,
    userProfile ? { userId: userProfile._id } : "skip"
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      case 'out-for-delivery': return 'delivering';
      default: return 'pending';
    }
  };

  const getTimelineStatus = (currentStatus) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    const currentIdx = steps.indexOf(currentStatus);
    return steps.map((step, index) => ({
      step,
      label: step.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      active: index <= currentIdx,
      completed: index < currentIdx
    }));
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>📦 My Orders</h1>
        </div>

        <div className="orders-list">
          {!currentUser ? (
            <div className="empty-state">
              <p>Please log in to view your orders.</p>
              <Link to="/login" className="btn-primary">Login</Link>
            </div>
          ) : !orders ? (
            <div className="loading-state">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found.</p>
              <Link to="/menu" className="btn-primary">Browse Menu</Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">#{order._id.substring(0, 8)}</span>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
                <div className="order-items">
                  <p>
                    {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                  </p>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-footer">
                  <span className="order-total">₹{order.totalAmount}</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="view-details-btn" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </button>
                    {['out-for-delivery'].includes(order.status) && (
                      <button className="track-btn">Track</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order #{selectedOrder._id.substring(0, 8)}</h2>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
              </div>

              <div className="modal-body">
                {/* Status Timeline */}
                <div className="order-timeline">
                  {getTimelineStatus(selectedOrder.status).map((s, i) => (
                    <div key={i} className={`timeline-step ${s.active ? 'active' : ''} ${s.completed ? 'completed' : ''}`}>
                      <div className="timeline-icon">{i + 1}</div>
                      <span className="timeline-label">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="address-section">
                  <h4>📍 Delivery Address</h4>
                  <p>{selectedOrder.deliveryAddress || "Address not provided"}</p>
                </div>

                <h3>Items</h3>
                <div className="items-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="bill-row">
                      <span>{item.quantity} x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="bill-section">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal || selectedOrder.totalAmount}</span>
                  </div>
                  <div className="bill-row">
                    <span>Delivery Fee</span>
                    <span>₹{selectedOrder.deliveryFee || 0}</span>
                  </div>
                  <div className="bill-row">
                    <span>Tax (5%)</span>
                    <span>₹{selectedOrder.tax || 0}</span>
                  </div>
                  <div className="bill-row total">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
