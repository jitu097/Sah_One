import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import './RestaurantStatus.css';

export default function RestaurantStatus() {
  const [showPopup, setShowPopup] = useState(false);
  const specialHours = useQuery(api.modules.servingHours.servingHours.getGlobalServingHours);
  const isRestaurantClosed = specialHours ? specialHours.isClosed : false; // Default Open

  useEffect(() => {
    // React to status changes
    if (isRestaurantClosed) {
      const hasSeenPopup = sessionStorage.getItem('closedPopupShown');
      if (!hasSeenPopup) {
        setShowPopup(true);
      }
    } else {
      // If open, close popup and reset session flag so it shows again next time it closes
      setShowPopup(false);
      sessionStorage.removeItem('closedPopupShown');
    }
  }, [isRestaurantClosed]);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Mark that user has seen the popup in this session
    sessionStorage.setItem('closedPopupShown', 'true');
  };

  // Function to check if user can add to cart (export this or use context)
  const canAddToCart = () => {
    return !isRestaurantClosed;
  };

  // Make the status available globally (Maintenance: largely deprecated, but kept for legacy external scripts)
  window.restaurantStatus = {
    isOpen: !isRestaurantClosed,
    canAddToCart: canAddToCart
  };

  if (!showPopup) return null;

  return (
    <div className="restaurant-status-overlay">
      <div className="restaurant-status-modal">
        <div className="status-icon">🔴</div>
        <h2>Temporarily Unavailable</h2>
        <p>We're currently not accepting orders at the moment.</p>
        <p className="status-subtitle">
          You can still browse our menu and explore what we offer!
        </p>
        <button className="status-ok-btn" onClick={handleClosePopup}>
          OK, Let me browse
        </button>
      </div>
    </div>
  );
}
