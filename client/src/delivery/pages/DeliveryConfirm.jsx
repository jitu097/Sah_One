import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryConfirm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Order
  const order = useQuery(api.modules.orders.orders.getOrderById, { orderId: orderId });
  const updateStatus = useMutation(api.modules.orders.orders.updateOrderStatus);

  if (loading) return <div className="delivery-loading">Loading auth...</div>;
  if (!currentUser) return <div className="delivery-loading">Please log in to continue.</div>;
  if (order === undefined) return <div className="delivery-loading">Loading order details...</div>;
  if (order === null) return <div className="delivery-error">Order not found.</div>;

  const handleComplete = async () => {
    try {
      setIsUpdating(true);
      await updateStatus({
        orderId: order._id,
        status: 'delivered'
      });
      // Navigate to history tab after completing delivery
      navigate('/delivery?tab=history');
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to complete delivery. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>✅ Confirm Delivery</h1>
        </div>

        <div className="confirm-details">
          <div className="detail-card">
            <h3 className="section-title">Order #{order._id.substring(0, 8)}</h3>

            <div className="detail-row">
              <span className="label">Customer:</span>
              <span className="value">👤 {order.customerName || 'Guest'}</span>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-row address-link"
            >
              <span className="label">Address:</span>
              <span className="value" style={{ textDecoration: 'underline', color: '#007bff' }}>📍 {order.deliveryAddress}</span>
            </a>

            <div className="detail-row">
              <span className="label">Amount to Collect:</span>
              <span className="value">₹{order.totalAmount}</span>
            </div>

            <div className="detail-row">
              <span className="label">Payment:</span>
              <span className="value">💳 {order.paymentMethod}</span>
            </div>

            {order.paymentMethod === 'Cash on Delivery' && (
              <div className="cod-alert">
                ⚠️ Please collect cash from customer
              </div>
            )}

            <div className="action-row">
              <button
                className="btn-complete-delivery"
                onClick={handleComplete}
                disabled={isUpdating}
              >
                {isUpdating ? 'Completing...' : 'Complete Delivery'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
