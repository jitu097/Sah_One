import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function AssignedOrders() {
  const { currentUser, loading } = useAuth();

  // Mutations
  const createDeliveryProfile = useMutation(api.modules.delivery.delivery.createOrUpdateDeliveryPerson);

  // 1. Get Delivery Person Details
  const deliveryPerson = useQuery(api.modules.delivery.delivery.getDeliveryPersonByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  // Self-Healing: If logged in but no profile, create it.
  useEffect(() => {
    async function syncProfile() {
      if (currentUser && deliveryPerson === null) {
        console.log("Auto-creating delivery profile...");
        try {
          await createDeliveryProfile({
            firebaseUid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || 'Delivery Person',
            phone: currentUser.phoneNumber || '9999999999',
            isAvailable: true,
          });
        } catch (e) {
          console.error("Auto-creation failed:", e);
        }
      }
    }
    syncProfile();
  }, [currentUser, deliveryPerson, createDeliveryProfile]);

  // 2. Get Assigned Orders
  const orders = useQuery(api.modules.orders.orders.getOrdersByDeliveryPerson,
    deliveryPerson ? { deliveryPersonId: deliveryPerson._id } : "skip"
  ) || [];

  const activeOrders = orders.filter(o => ['preparing', 'out-for-delivery'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const [activeTab, setActiveTab] = useState('active');

  if (loading) return <div className="delivery-loading">Loading auth...</div>;
  if (!currentUser) return <div className="delivery-loading">Please log in...</div>;
  if (deliveryPerson === undefined) return <div className="delivery-loading">Loading profile...</div>;
  if (!deliveryPerson) return (
    <div className="delivery-error">
      <p>Profile syncing...</p>
      <p className="small-text">Account: {currentUser.email}</p>
      <p>Please wait...</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>My Deliveries</h1>
          <div className="delivery-tabs">
            <button
              className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active ({activeOrders.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
        </div>

        <div className="delivery-list">
          {activeTab === 'active' ? (
            activeOrders.length === 0 ? (
              <div className="empty-state">No active orders assigned.</div>
            ) : (
              activeOrders.map(order => (
                <div key={order._id} className="delivery-card">
                  <div className="order-info">
                    <div className="order-header-row">
                      <h3>Order #{order._id.substring(0, 8)}</h3>
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
                    </div>
                    <p className="customer">👤 {order.customerName || 'Guest'}</p>
                    <p className="address">📍 {order.deliveryAddress}</p>
                    <p className="amount">💰 ₹{order.totalAmount}</p>
                  </div>
                  <div className="order-actions">
                    {order.status === 'preparing' && (
                      <Link to={`/delivery/pickup/${order._id}`} className="btn-pickup">Pickup Order</Link>
                    )}
                    {order.status === 'out-for-delivery' && (
                      <Link to={`/delivery/confirm/${order._id}`} className="btn-confirm">Complete Delivery</Link>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            pastOrders.length === 0 ? (
              <div className="empty-state">No past orders.</div>
            ) : (
              pastOrders.map(order => (
                <div key={order._id} className="delivery-card history">
                  <div className="order-info">
                    <div className="order-header-row">
                      <h3>Order #{order._id.substring(0, 8)}</h3>
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
                    </div>
                    <p className="address">📍 {order.deliveryAddress}</p>
                    <p className="date">📅 {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </>
  );
}
