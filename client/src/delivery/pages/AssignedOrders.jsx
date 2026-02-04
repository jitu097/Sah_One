import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function AssignedOrders() {
  const { currentUser, loading } = useAuth();

  // Mutations
  const createDeliveryProfile = useMutation(api.modules.delivery.delivery.createOrUpdateDeliveryPerson);
  const updateOrderStatus = useMutation(api.modules.orders.orders.updateOrderStatus);

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

  // 2. Get Assigned Orders (preparing and not started)
  const assignedOrders = useQuery(api.modules.orders.orders.getAssignedOrders,
    deliveryPerson ? { deliveryPersonId: deliveryPerson._id.toString() } : "skip"
  ) || [];

  // 3. Get Ongoing Orders (out-for-delivery and started)
  const ongoingOrders = useQuery(api.modules.orders.orders.getOngoingOrders,
    deliveryPerson ? { deliveryPersonId: deliveryPerson._id.toString() } : "skip"
  ) || [];

  // 4. Get History Orders (delivered or cancelled)
  const historyOrders = useQuery(api.modules.orders.orders.getDeliveryHistory,
    deliveryPerson ? { deliveryPersonId: deliveryPerson._id.toString() } : "skip"
  ) || [];

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'assigned'; // assigned, ongoing, history

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleStartDelivery = async (orderId) => {
    try {
      await updateOrderStatus({
        orderId: orderId,
        status: 'out-for-delivery'
      });
      // Redirect to confirmation page instead of ongoing tab
      window.location.href = `/delivery/confirm/${orderId}`;
    } catch (error) {
      console.error("Error starting delivery:", error);
      alert("Failed to start delivery. Please try again.");
    }
  };

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
              className={`tab-btn ${currentTab === 'assigned' ? 'active' : ''}`}
              onClick={() => handleTabChange('assigned')}
            >
              Assigned ({assignedOrders.length})
            </button>
            <button
              className={`tab-btn ${currentTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => handleTabChange('ongoing')}
            >
              Ongoing ({ongoingOrders.length})
            </button>
            <button
              className={`tab-btn ${currentTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              History
            </button>
          </div>
        </div>

        <div className="delivery-list">
          {currentTab === 'assigned' && (
            assignedOrders.length === 0 ? (
              <div className="empty-state">No new orders assigned.</div>
            ) : (
              assignedOrders.map(order => (
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
                    <button onClick={() => handleStartDelivery(order._id)} className="btn-pickup">Start Delivering</button>
                  </div>
                </div>
              ))
            )
          )}

          {currentTab === 'ongoing' && (
            ongoingOrders.length === 0 ? (
              <div className="empty-state">
                <p>No ongoing deliveries.</p>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Start a delivery from the Assigned tab to see it here.
                </p>
              </div>
            ) : (
              ongoingOrders.map(order => (
                <div key={order._id} className="delivery-card">
                  <div className="order-info">
                    <div className="order-header-row">
                      <h3>Order #{order._id.substring(0, 8)}</h3>
                      <span className={`status-badge ${order.status}`}>out-for-delivery</span>
                    </div>
                    <p className="customer">👤 {order.customerName || 'Guest'}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: '#007bff' }}
                    >
                      <p className="address">📍 {order.deliveryAddress}</p>
                    </a>
                    <p className="amount">💰 ₹{order.totalAmount}</p>
                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>💳 {order.paymentMethod}</p>
                  </div>
                  <div className="order-actions">
                    <Link to={`/delivery/confirm/${order._id}`} className="btn-confirm">
                      Complete Delivery
                    </Link>
                  </div>
                </div>
              ))
            )
          )}

          {currentTab === 'history' && (
            historyOrders.length === 0 ? (
              <div className="empty-state">No delivery history.</div>
            ) : (
              historyOrders.map(order => (
                <div key={order._id} className="delivery-card history">
                  <div className="order-info">
                    <div className="order-header-row">
                      <h3>Order #{order._id.substring(0, 8)}</h3>
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
                    </div>
                    <p className="address">📍 {order.deliveryAddress}</p>
                    <p className="amount">💰 ₹{order.totalAmount}</p>
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
