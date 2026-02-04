import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/orders.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');

  // Convex Queries and Mutations
  const ordersRaw = useQuery(api.modules.orders.orders.getAllOrders) || [];
  const deliveryPersonnel = useQuery(api.modules.delivery.delivery.getAllDeliveryPersonnel) || [];

  const updateOrderStatus = useMutation(api.modules.orders.orders.updateOrderStatus);
  const assignDeliveryPerson = useMutation(api.modules.orders.orders.assignDeliveryPerson);
  const cancelOrder = useMutation(api.modules.orders.orders.cancelOrder);

  // Sort orders: Active statuses first (pending, confirmed, preparing, out-for-delivery), then by newest first
  const sortedOrders = [...ordersRaw].sort((a, b) => {
    const activeStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery'];
    const aIsActive = activeStatuses.includes(a.status);
    const bIsActive = activeStatuses.includes(b.status);
    
    // If both active or both inactive, sort by date (newest first)
    if (aIsActive === bIsActive) {
      return b.createdAt - a.createdAt;
    }
    
    // Active orders come before inactive
    return aIsActive ? -1 : 1;
  });

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'All'
    ? sortedOrders
    : sortedOrders.filter(order => order.status.toLowerCase() === activeTab.toLowerCase().replace(/\s+/g, '-'));

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
    setSelectedDriver('');
  };

  const handleAssignSubmit = async () => {
    if (!selectedDriver) {
      alert("Please select a delivery person");
      return;
    }
    try {
      await assignDeliveryPerson({
        orderId: selectedOrder._id,
        deliveryPersonId: selectedDriver.toString() // Ensure it's a string
      });
      setShowAssignModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver");
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder({ orderId });
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel order");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#fceabb'; // Orange-ish
      case 'confirmed': return '#a8edea'; // Blue-ish
      case 'preparing': return '#fff6b2'; // Yellow
      case 'out-for-delivery': return '#d4fc79'; // Green-ish
      case 'delivered': return '#c2e9fb'; // Blue
      case 'cancelled': return '#fccb90'; // Red-ish
      default: return '#eee';
    }
  };

  // Helper to format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Helper to get delivery person name
  const getDeliveryPersonName = (id) => {
    const person = deliveryPersonnel.find(p => p._id === id);
    return person ? person.name : 'Unknown';
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-content">
            <h1>📦 Manage Orders</h1>
            <p>Overview: {ordersRaw.length} Total | {ordersRaw.filter(o => o.status === 'pending').length} Pending Action</p>
          </div>
          <div className="header-actions">
            {/* Future: Date filter or export button */}
          </div>
        </header>

        <div className="orders-filters-bar">
          <div className="orders-tabs">
            {['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(tab => (
              <button
                key={tab}
                className={`tab-filter-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="orders-grid-container">
          {filteredOrders.length === 0 ? (
            <div className="no-orders-state">
              <span className="empty-icon">📭</span>
              <h3>No Orders Found</h3>
              <p>There are no orders in the "{activeTab}" category at the moment.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className={`order-card-new ${order.status}`}>
                <div className="order-card-header">
                  <div className="order-id-section">
                    <span className="order-hash">#</span>
                    <span className="order-id-text">{order._id.substring(0, 8)}...</span>
                  </div>
                  <span className={`status-badge-new ${order.status}`}>
                    {order.status.replace(/-/g, ' ')}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="customer-details">
                    <div className="detail-row">
                      <span className="icon">👤</span>
                      <span className="text-bold">{order.customerName || order.user?.name || 'Guest User'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="icon">📞</span>
                      <span>{order.customerPhone || order.user?.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="icon">📧</span>
                      <span>{order.customerEmail || order.user?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-row address">
                      <span className="icon">📍</span>
                      <span>{order.deliveryAddress || 'Pick up'}</span>
                    </div>
                    {order.paymentMethod && (
                      <div className="detail-row">
                        <span className="icon">💳</span>
                        <span>Payment: {order.paymentMethod}</span>
                      </div>
                    )}
                  </div>

                  <div className="order-items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        {item.image && <img src={item.image} alt={item.name} className="item-thumbnail" />}
                        <div className="item-details">
                          <span className="qty-badge">{item.quantity}x</span>
                          <span className="item-name">{item.name}</span>
                          {item.portion && <span className="item-portion">({item.portion})</span>}
                        </div>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary-section">
                    {order.subtotal && (
                      <div className="order-summary-row">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal}</span>
                      </div>
                    )}
                    {order.deliveryCharge !== undefined && (
                      <div className="order-summary-row">
                        <span>Delivery Charge</span>
                        <span>₹{order.deliveryCharge}</span>
                      </div>
                    )}
                    <div className="order-summary-row total-row">
                      <span>Total Amount</span>
                      <span className="total-price">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="delivery-partner-section">
                    <span className="label">Delivery Partner:</span>
                    {order.deliveryPersonId ? (
                      <span className="partner-name assigned">🛵 {getDeliveryPersonName(order.deliveryPersonId)}</span>
                    ) : (
                      <span className="partner-name unassigned">Not Assigned</span>
                    )}
                  </div>
                </div>

                <div className="order-card-footer">
                  <div className="timestamp">
                    🕒 {formatDate(order.createdAt)}
                  </div>
                  <div className="card-actions">
                    {order.status === 'pending' && (
                      <>
                        <button className="action-btn-new accept" onClick={() => handleStatusUpdate(order._id, 'confirmed')}>Accept</button>
                        <button className="action-btn-new reject" onClick={() => handleCancel(order._id)}>Reject</button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button className="action-btn-new factory" onClick={() => handleStatusUpdate(order._id, 'preparing')}>Start Cooking</button>
                    )}
                    {order.status === 'preparing' && (
                      <button className="action-btn-new delivery" onClick={() => handleAssignClick(order)}>Assign Driver</button>
                    )}
                    {order.status === 'out-for-delivery' && (
                      <button className="action-btn-new finish" onClick={() => handleStatusUpdate(order._id, 'delivered')}>Complete</button>
                    )}
                    {/* Cancel option for non-final states */}
                    {['pending', 'confirmed', 'preparing'].includes(order.status) && (
                      <button className="has-tooltip cancel-icon" onClick={() => handleCancel(order._id)} title="Cancel Order">✖</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Assign Driver Modal */}
        {showAssignModal && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <div className="modal-content slide-in medium" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Assign Delivery Partner</h2>
                <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
              </div>

              <div className="modal-body-padded">
                <div className="order-assign-summary">
                  Assigning for Order <strong>#{selectedOrder?._id.substring(0, 8)}</strong>
                </div>

                <div className="driver-list-container">
                  {deliveryPersonnel.length === 0 ? (
                    <p className="no-data-text">No delivery personnel found.</p>
                  ) : (
                    <div className="drivers-grid">
                      {deliveryPersonnel.map(person => (
                        <label key={person._id} className={`driver-option ${!person.isAvailable ? 'busy' : ''} ${selectedDriver === person._id.toString() ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="driver"
                            value={person._id.toString()}
                            disabled={!person.isAvailable}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                          />
                          <div className="driver-card-content">
                            <div className="driver-avatar">🛵</div>
                            <div className="driver-info">
                              <span className="driver-name">{person.name}</span>
                              <span className="driver-status">{person.isAvailable ? 'Available' : 'Busy'}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-footer-simple">
                  <button className="btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleAssignSubmit} disabled={!selectedDriver}>Confirm Assignment</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
