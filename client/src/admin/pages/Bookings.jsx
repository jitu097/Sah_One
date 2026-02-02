import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import '../styles/bookings.css';

export default function Bookings() {
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Fetch all bookings
  const allBookings = useQuery(api.modules.bookings.bookings.getAllBookings);
  const updateBookingStatus = useMutation(api.modules.bookings.bookings.updateBookingStatus);
  const deleteBooking = useMutation(api.modules.bookings.bookings.deleteBooking);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus({ bookingId, status: newStatus });
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking({ bookingId });
        alert('Booking deleted successfully!');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
      }
    }
  };

  const getFilteredBookings = () => {
    if (!allBookings) return [];
    if (filterStatus === 'all') return allBookings;
    return allBookings.filter(booking => booking.status === filterStatus);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredBookings = getFilteredBookings();
  
  // Sort bookings: active (pending, accepted) first, then past (rejected, cancelled)
  // Within each group, sort by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const activeStatuses = ['pending', 'accepted'];
    const aIsActive = activeStatuses.includes(a.status);
    const bIsActive = activeStatuses.includes(b.status);
    
    if (aIsActive === bIsActive) {
      return b.createdAt - a.createdAt; // Newest first within same group
    }
    return aIsActive ? -1 : 1; // Active bookings first
  });

  return (
    <>
      <Navbar />
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>Table Bookings</h1>
        </div>

        <div className="bookings-filters">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filterStatus === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilterStatus('accepted')}
          >
            Accepted
          </button>
          <button
            className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilterStatus('rejected')}
          >
            Rejected
          </button>
        </div>

        <div className="bookings-list">
          {!allBookings ? (
            <div className="loading">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found</p>
            </div>
          ) : (
            sortedBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h3>{booking.name}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="booking-date">
                    <span className="date">{formatDate(booking.date)}</span>
                    <span className="time">{formatTime(booking.time)}</span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{booking.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Guests:</span>
                    <span className="detail-value">{booking.guests} people</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Booking Date:</span>
                    <span className="detail-value">
                      {new Date(booking.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        className="action-btn accept-btn"
                        onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'accepted' && (
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
