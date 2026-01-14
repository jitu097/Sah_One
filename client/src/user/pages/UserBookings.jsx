import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/UserBookings.css';

export default function UserBookings() {
  const { currentUser } = useAuth();
  
  // Get user data
  const getUserByFirebaseUid = useQuery(
    api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );
  
  // Get user's bookings
  const myBookings = useQuery(
    api.modules.bookings.bookings.getBookingsByUserId,
    getUserByFirebaseUid ? { userId: getUserByFirebaseUid._id } : "skip"
  );

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

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your booking is being reviewed. We will notify you once it is confirmed.';
      case 'accepted':
        return 'Your booking has been confirmed! We look forward to serving you.';
      case 'rejected':
        return 'Unfortunately, we cannot accommodate this booking at the moment.';
      case 'cancelled':
        return 'This booking has been cancelled.';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
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

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="user-bookings-container">
          <div className="no-bookings">
            <p>Please login to view your bookings</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="user-bookings-container">
        <div className="bookings-header">
          <h1>My Table Bookings</h1>
          <p className="bookings-subtitle">Track your table reservation requests</p>
        </div>

        <div className="bookings-list">
          {!myBookings ? (
            <div className="loading">Loading your bookings...</div>
          ) : myBookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">📅</div>
              <h3>No Bookings Yet</h3>
              <p>You haven't made any table bookings yet. Book a table from the home page!</p>
            </div>
          ) : (
            myBookings.map((booking) => (
              <div key={booking._id} className="user-booking-card">
                <div className="booking-card-header">
                  <div className="booking-date-time">
                    <div className="booking-date-large">{formatDate(booking.date)}</div>
                    <div className="booking-time-large">{formatTime(booking.time)}</div>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="booking-details-user">
                  <div className="detail-row">
                    <span className="detail-icon">👤</span>
                    <span className="detail-text">{booking.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📱</span>
                    <span className="detail-text">{booking.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </div>

                <div className="booking-status-message">
                  <p className={`status-message ${booking.status}`}>
                    {getStatusMessage(booking.status)}
                  </p>
                </div>

                <div className="booking-footer">
                  <span className="booking-created">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
