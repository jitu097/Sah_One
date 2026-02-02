import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import '../styles/navbar.css';
import NotificationBell from '../../user/components/NotificationBell';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeConfig = useQuery(api.modules.servingHours.servingHours.getGlobalServingHours);
  const toggleStatus = useMutation(api.modules.servingHours.servingHours.toggleRestaurantStatus);

  // Derived state from DB (default to Open/True if not yet loaded to avoid flash, or False? 
  // Safety: Default false (closed) until loaded is safer, OR check undefined.
  // Existing logic defaulted to TRUE. Let's stick to that but handle loading.
  const restaurantOpen = activeConfig ? !activeConfig.isClosed : true;

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleRestaurant = async () => {
    const isCurrentlyOpen = restaurantOpen;
    const newStatus = !isCurrentlyOpen; // if Open (true), new is False (Closed)
    // The mutation takes "isClosed". 
    // If we want to OPEN (newStatus=true), isClosed should be false.
    // If we want to CLOSE (newStatus=false), isClosed should be true.

    try {
      await toggleStatus({
        isClosed: !newStatus // isClosed = true means CLOSED (false)
      });

      // Notification logic remains, but driven by success
      if (newStatus) {
        alert('🟢 Restaurant is now OPEN. Users can browse and place orders.');
      } else {
        alert('🔴 Restaurant is now CLOSED. Users can browse but cannot place orders.');
      }

    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to update restaurant status");
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-left">
        <img src="/LOGO.png" alt="SAH_ONE Admin" className="admin-logo" />
        <button
          className={`restaurant-toggle-btn ${restaurantOpen ? 'open' : 'closed'}`}
          onClick={toggleRestaurant}
          title={`Click to ${restaurantOpen ? 'close' : 'open'} restaurant`}
        >
          <span className="toggle-icon">{restaurantOpen ? '🟢' : '🔴'}</span>
          <span className="toggle-text">
            Admin Panel
            <span className="toggle-status">{restaurantOpen ? 'OPEN' : 'CLOSED'}</span>
          </span>
        </button>
      </div>

      <div className="admin-nav-center">
        <Link to="/admin" className={`admin-nav-link ${isActive('/admin')}`}>
          Dashboard
        </Link>
        <Link to="/admin/menu" className={`admin-nav-link ${isActive('/admin/menu')}`}>
          Menu
        </Link>
        <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
          Orders
        </Link>
        <Link to="/admin/bookings" className={`admin-nav-link ${isActive('/admin/bookings')}`}>
          Bookings
        </Link>
        <Link to="/admin/offers" className={`admin-nav-link ${isActive('/admin/offers')}`}>
          Offers
        </Link>
        <Link to="/admin/reports" className={`admin-nav-link ${isActive('/admin/reports')}`}>
          Reports
        </Link>
        <Link to="/admin/profile" className={`admin-nav-link ${isActive('/admin/profile')}`}>
          Profile
        </Link>
      </div>

      <div className="admin-nav-right">
        <NotificationBell isAdmin={true} />
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
