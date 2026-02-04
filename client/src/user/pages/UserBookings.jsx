import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/UserBookings.css';
import '../styles/pages.css';
import { isRestaurantOpen } from '../../utils/restaurantStatus';

export default function UserBookings() {
  const { currentUser } = useAuth();
  
  // Party booking modal state
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [partyForm, setPartyForm] = useState({
    name: '',
    phone: '',
    guests: '',
    date: '',
    time: ''
  });
  
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
  
  // Mutation for creating booking
  const createBooking = useMutation(api.modules.bookings.bookings.createBooking);
  const specialHours = useQuery(api.modules.servingHours.servingHours.getGlobalServingHours);
  const restaurantOpen = isRestaurantOpen(specialHours);

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
  
  // Party form handlers
  const handlePartyFormChange = (e) => {
    setPartyForm({
      ...partyForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePartyFormSubmit = async (e) => {
    e.preventDefault();

    if (!restaurantOpen) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting bookings at the moment.');
      return;
    }

    if (!currentUser) {
      alert('Please login to book a table!');
      return;
    }

    if (!getUserByFirebaseUid) {
      alert('Please wait, loading user data...');
      return;
    }

    try {
      await createBooking({
        userId: getUserByFirebaseUid._id,
        name: partyForm.name,
        phone: partyForm.phone,
        guests: parseInt(partyForm.guests),
        date: partyForm.date,
        time: partyForm.time,
      });

      alert('Table booking submitted successfully! We will notify you once it is confirmed.');
      setShowPartyModal(false);
      setPartyForm({ name: '', phone: '', guests: '', date: '', time: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
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
        {!restaurantOpen && (
          <div className="restaurant-closed-info">
            ⚠️ Restaurant currently closed. You can browse, but booking is disabled.
          </div>
        )}
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
        
        {/* Floating Book a Table Button */}
        <button
          className="fab-book-table"
          onClick={() => restaurantOpen && setShowPartyModal(true)}
          title={restaurantOpen ? 'Book Now' : 'Restaurant closed'}
          disabled={!restaurantOpen}
        >
          <span className="fab-icon">🍽️</span>
          <span className="fab-text">Book Now</span>
        </button>

        {/* Party Booking Modal */}
        {showPartyModal && (
          <div className="modal-overlay" onClick={() => setShowPartyModal(false)}>
            <div className="party-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowPartyModal(false)}>
                ×
              </button>
              <h2>Party Booking Enquiry</h2>
              <form onSubmit={handlePartyFormSubmit} className="party-form">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={partyForm.name}
                    onChange={handlePartyFormChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={partyForm.phone}
                    onChange={handlePartyFormChange}
                    required
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Number of Guests *</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={partyForm.guests}
                    onChange={handlePartyFormChange}
                    required
                    placeholder="Enter number of guests"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date for Booking *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={partyForm.date}
                    onChange={handlePartyFormChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={partyForm.time}
                    onChange={handlePartyFormChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Submit Enquiry
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
