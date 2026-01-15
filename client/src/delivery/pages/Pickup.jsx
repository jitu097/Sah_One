import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function Pickup() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Order
  const order = useQuery(api.modules.orders.orders.getOrderById, { orderId: orderId });
  const updateStatus = useMutation(api.modules.orders.orders.updateOrderStatus);

  if (order === undefined) return <div className="delivery-loading">Loading order details...</div>;
  if (order === null) return <div className="delivery-error">Order not found.</div>;

  const handlePickup = async () => {
    try {
      setIsUpdating(true);
      await updateStatus({
        orderId: order._id,
        status: 'out-for-delivery'
      });
      navigate('/delivery');
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to confirm pickup. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>🏪 Pickup Order</h1>
        </div>

        <div className="pickup-details">
          <div className="detail-card">
            <h3 className="section-title">Order #{order._id.substring(0, 8)}</h3>

            <div className="detail-row">
              <span className="label">Customer:</span>
              <span className="value">{order.customerName || 'Guest'}</span>
            </div>

            <div className="items-list">
              <h4>Items to Pickup:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-qty">{item.quantity}x</span>
                  <span className="item-name">{item.name} {item.portion ? `(${item.portion})` : ''}</span>
                </div>
              ))}
            </div>

            <div className="detail-row total">
              <span className="label">Total Amount:</span>
              <span className="value">₹{order.totalAmount}</span>
            </div>

            <div className="action-row">
              <button
                className="btn-confirm-pickup"
                onClick={handlePickup}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Confirm Pickup'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
