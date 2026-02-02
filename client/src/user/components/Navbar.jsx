import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import "../styles/navbar.css";
import SideBar from "./SideBar";
import { useCart } from "../../context/CartContext";

import AddressModal from "./AddressModal";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [savedAddress, setSavedAddress] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const { cartItems } = useCart();
  const { currentUser } = useAuth();

  // Fetch user from DB to get saved address
  const user = useQuery(api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );
  const updateUser = useMutation(api.modules.users.users.updateUser);

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveAddress = async (addressData) => {
    // Generate display text: Delivery Area, Company Name
    const locationText = `${addressData.deliveryArea || ''}${addressData.company ? ', ' + addressData.company : ''}`.trim();
    setUserLocation(locationText);
    setSavedAddress(addressData);

    // Always save to localStorage for UI cache/guest support
    localStorage.setItem('userLocation', locationText);
    localStorage.setItem('userAddress', JSON.stringify(addressData));

    // If logged in, sync to DB "users" table
    if (currentUser && user) {
      try {
        await updateUser({
          firebaseUid: currentUser.uid,
          address: JSON.stringify(addressData)
        });
      } catch (err) {
        console.error("Failed to sync address to DB:", err);
      }
    }
  };

  // Load saved location on mount or when user data loads
  useEffect(() => {
    if (user && user.address) {
      try {
        const addr = JSON.parse(user.address);
        // Display: Delivery Area, Company
        const locationText = `${addr.deliveryArea || ''}${addr.company ? ', ' + addr.company : ''}`.trim();
        setUserLocation(locationText);
        setSavedAddress(addr);

        // Sync back to local storage for consistency
        localStorage.setItem('userLocation', locationText);
        localStorage.setItem('userAddress', user.address);
      } catch (e) {
        console.error("Error parsing DB address:", e);
      }
    } else {
      // Fallback to local storage (e.g. guest or first load)
      const savedLocation = localStorage.getItem('userLocation');
      const savedAddrString = localStorage.getItem('userAddress');

      setUserLocation(savedLocation || "");
      if (savedAddrString) {
        try {
          setSavedAddress(JSON.parse(savedAddrString));
        } catch (e) {
          console.error("Error parsing local storage address:", e);
        }
      }
    }
  }, [user]);

  // Sync internal state with URL params (e.g. on back button)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // Click outside to collapse search
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowMobileSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If on a different page, navigate to home first while preserving the search param
    if (window.location.pathname !== "/user" && window.location.pathname !== "/home") {
      navigate(`/user?search=${encodeURIComponent(value)}`);
    } else {
      // Update URL params
      setSearchParams(prev => {
        if (value) {
          prev.set("search", value);
        } else {
          prev.delete("search");
        }
        return prev;
      }, { replace: true });
    }
  };

  const handleSearchExpand = () => {
    setIsSearchExpanded(true);
    // Optional: focus input if not already focused
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <>
      <nav className={`navbar ${isSearchExpanded ? 'navbar-expanded' : ''}`}>
        {!isSearchExpanded && (
          <div className="nav-left">
            <Link to="/user">
              <img src="/LOGO.png" alt="SAH_ONE" className="logo-img" />
            </Link>
            <button
              className="mobile-location-btn"
              onClick={() => setIsAddressModalOpen(true)}
              aria-label="Set location"
            >
              📍
            </button>
            <button
              className="location"
              onClick={() => setIsAddressModalOpen(true)}
            >
              📍 {userLocation && userLocation.trim() !== '' ? userLocation : 'Location'}
            </button>
          </div>
        )}

        <div className={`nav-center ${isSearchExpanded ? 'expanded' : ''}`}>
          {/* Mobile search overlay */}
          {showMobileSearch && (
            <div className="mobile-search-overlay" ref={mobileSearchRef}>
              <button
                className="mobile-search-back"
                onClick={() => setShowMobileSearch(false)}
                aria-label="Back"
              >
                <svg width="24" height="24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              </button>
              <input
                type="text"
                placeholder="Search for atta dal and more"
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
                className="mobile-search-input"
              />
            </div>
          )}
          {/* Desktop and mobile icon */}
          <div
            className="search-container"
            ref={searchContainerRef}
            onClick={handleSearchExpand}
          >
            {isSearchExpanded && (
              <button
                className="search-back-btn"
                onClick={(e) => {
                  e.stopPropagation(); // prevent re-expanding
                  setIsSearchExpanded(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
            )}
            <button
              className="search-btn mobile-only"
              style={{ display: showMobileSearch ? 'none' : undefined }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileSearch(true);
              }}
              aria-label="Open search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for atta dal and more"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchExpanded(true)}
              className="search-input"
            />
            <button className="search-btn desktop-only">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {!isSearchExpanded && (
          <div className="nav-right">
            <Link to="/user/cart" className="cart-btn">
              <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-text">Cart</span>
              <span className="cart-count">{cartItems.length}</span>
            </Link>
            <NotificationBell userId={currentUser?.uid} />
            <img
              src="/hamburger.png"
              alt="Menu"
              className="hamburger-icon"
              onClick={toggleSidebar}
            />
          </div>
        )}
      </nav>
      <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialAddress={savedAddress}
      />
    </>
  );
}