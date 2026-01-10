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

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'All'
    ? ordersRaw
    : ordersRaw.filter(order => order.status.toLowerCase() === activeTab.toLowerCase().replace(/\s+/g, '-'));

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
        deliveryPersonId: selectedDriver
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
        <div className="admin-header">
          <h1>📦 Manage Orders</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Total Orders: {ordersRaw.length} | Pending: {ordersRaw.filter(o => o.status === 'pending').length}
          </p>
        </div>

        <div className="orders-tabs-container">
          {['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found in {activeTab} status.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className="order-card" style={{ borderLeft: `5px solid ${getStatusColor(order.status)}` }}>
                <div className="order-header">
                  <div className="order-id">
                    <strong>Order #{order._id.substring(0, 8)}...</strong>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                    {order.status.toUpperCase().replace(/-/g, ' ')}
                  </div>
                </div>

                <div className="order-body">
                  <div className="customer-info">
                    <h4>Customer</h4>
                    <p>{order.user?.name || 'Guest'}</p>
                    <p>{order.user?.phone || 'No Phone'}</p>
                    <p className="address">{order.deliveryAddress}</p>
                  </div>

                  <div className="order-items">
                    <h4>Items</h4>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity} x {item.name} <span className="item-price">₹{item.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="order-total">
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>

                  <div className="delivery-info">
                    <h4>Delivery</h4>
                    {order.deliveryPersonId ? (
                      <p>Driver: {getDeliveryPersonName(order.deliveryPersonId)}</p>
                    ) : (
                      <p>Not Assigned</p>
                    )}
                  </div>
                </div>

                <div className="order-actions">
                  {order.status === 'pending' && (
                    <>
                      <button className="action-btn confirm" onClick={() => handleStatusUpdate(order._id, 'confirmed')}>✅ Accept</button>
                      <button className="action-btn cancel" onClick={() => handleCancel(order._id)}>❌ Reject</button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button className="action-btn prepare" onClick={() => handleStatusUpdate(order._id, 'preparing')}>👨‍🍳 Start Preparing</button>
                  )}
                  {order.status === 'preparing' && (
                    <button className="action-btn delivery" onClick={() => handleAssignClick(order)}>🛵 Assign Delivery</button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <button className="action-btn complete" onClick={() => handleStatusUpdate(order._id, 'delivered')}>🏁 Mark Delivered</button>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'pending' && (
                    <button className="action-btn cancel-small" onClick={() => handleCancel(order._id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Assign Driver Modal */}
        {showAssignModal && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <div className="modal-content assign-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Assign Delivery Partner</h3>
              <p>Order #{selectedOrder?._id.substring(0, 8)}</p>

              <div className="driver-selection">
                {deliveryPersonnel.length === 0 ? (
                  <p>No delivery personnel available using delivery module.</p>
                ) : (
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="driver-select"
                  >
                    <option value="">-- Select Driver --</option>
                    {deliveryPersonnel.map(person => (
                      <option key={person._id} value={person._id} disabled={!person.isAvailable}>
                        {person.name} ({person.phone}) {person.isAvailable ? '' : '- Busy'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button className="confirm-btn" onClick={handleAssignSubmit}>Assign & Dispatch</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
