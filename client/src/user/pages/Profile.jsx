import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddressModal from '../components/AddressModal';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import '../styles/pages.css';
import '../styles/Profile.css';

export default function Profile() {
  const { currentUser } = useAuth();

  // Fetch user data from Convex
  const user = useQuery(api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  const updateUser = useMutation(api.modules.users.users.updateUser);

  const [isEditing, setIsEditing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    name: ''
  });
  // State to hold the parsed address object for the modal
  const [parsedAddress, setParsedAddress] = useState(null);
  const [addressRefresh, setAddressRefresh] = useState(0);

  // Sync delivery address from localStorage or User DB
  useEffect(() => {
    if (user) {
      // Logic mirrors Navbar.jsx to ensure consistency
      // Try to parse DB address first, then fallback to localStorage
      let addressData = null;
      let displayString = '';

      if (user.address) {
        try {
          // Check if it's JSON (new format) or string (old format)
          if (user.address.trim().startsWith('{')) {
            addressData = JSON.parse(user.address);
            displayString = `${addressData.deliveryArea || ''}${addressData.company ? ', ' + addressData.company : ''}`.trim();
          } else {
            // Legacy plain string fallback
            displayString = user.address;
          }
        } catch (e) {
          console.error("Failed to parse user address in Profile:", e);
          displayString = user.address; // Fallback
        }
      }

      // If no DB address, try localStorage
      if (!addressData) {
        const saved = localStorage.getItem('userAddress');
        if (saved) {
          try {
            addressData = JSON.parse(saved);
            displayString = `${addressData.deliveryArea || ''}${addressData.company ? ', ' + addressData.company : ''}`.trim();
          } catch (e) { }
        }
      }

      setParsedAddress(addressData);

      setFormData({
        phone: user.phone || (addressData ? addressData.mobileNumber : ''),
        // For the "edit profile" text area, we might want the formatted string or just leave it. 
        // But for the modal, we use parsedAddress.
        address: displayString,
        name: user.name || ''
      });
      setPhoneInput(user.phone || (addressData ? addressData.mobileNumber : ''));
    }
  }, [user, addressRefresh]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      // NOTE: main update profile form uses formData.address which is a string.
      // If we want to keep consistency, we should probably advise using the AddressModal for address updates.
      // But if they edit here, it might overwrite the JSON with a string. 
      // For now, let's keep it but be aware it might revert to string mode if used.
      // Ideally, remove address editing from this simple form and force usage of Modal.

      await updateUser({
        firebaseUid: user.firebaseUid,
        phone: formData.phone,
        address: formData.address, // This might be the display string
        name: formData.name
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAddressSave = async (addressData) => {
    // Generate display text: Delivery Area, Company Name
    const displayString = `${addressData.deliveryArea || ''}${addressData.company ? ', ' + addressData.company : ''}`.trim();

    try {
      await updateUser({
        firebaseUid: user.firebaseUid,
        address: JSON.stringify(addressData), // Save as JSON object string!
        phone: addressData.mobileNumber || user.phone,
        name: user.name || ''
      });

      // Save to localStorage
      localStorage.setItem('userAddress', JSON.stringify(addressData));
      localStorage.setItem('userLocation', displayString); // Sync location display text too

      setFormData(prev => ({
        ...prev,
        address: displayString,
        phone: addressData.mobileNumber || prev.phone
      }));
      setParsedAddress(addressData); // Update parsed state for modal

      setIsAddressModalOpen(false); // Close directly
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  const handlePhoneSave = async (e) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      // Create updated address object if it exists
      let updatedAddressData = parsedAddress;
      let addressStringToSave = user.address || '';

      if (parsedAddress) {
        updatedAddressData = {
          ...parsedAddress,
          mobileNumber: phoneInput
        };
        addressStringToSave = JSON.stringify(updatedAddressData);

        // Sync to localStorage
        localStorage.setItem('userAddress', addressStringToSave);
      }

      await updateUser({
        firebaseUid: user.firebaseUid,
        phone: phoneInput,
        address: addressStringToSave,
        name: user.name || ''
      });

      setFormData(prev => ({
        ...prev,
        phone: phoneInput,
        address: parsedAddress ? `${updatedAddressData.deliveryArea || ''}${updatedAddressData.company ? ', ' + updatedAddressData.company : ''}`.trim() : prev.address
      }));
      setParsedAddress(updatedAddressData);
      setIsPhoneModalOpen(false);
    } catch (error) {
      console.error("Failed to save phone:", error);
      alert("Failed to save phone number. Please try again.");
    }
  };

  if (!currentUser) return <div>Please login first</div>;
  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>👤 Profile</h1>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="profile-edit-form">
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  rows="3"
                  value={formData.address} // Display string
                  readOnly // Make read-only in this simple view to encourage using the Modal for structured data
                  onClick={() => { setIsEditing(false); setIsAddressModalOpen(true); }} // Redirect to modal
                  placeholder="Click to manage address via popup"
                  style={{ cursor: 'pointer', backgroundColor: '#f9fafb' }}
                />
                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                  Click to edit full address details
                </small>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="profile-section">
              <div className="profile-avatar" style={{ background: 'transparent' }}><img src="/people.png" alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%' }} /></div>
              <h2>{user.name || 'User'}</h2>
              <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-options">
              <div className="option-item" onClick={() => setIsAddressModalOpen(true)} style={{ cursor: 'pointer' }}>
                <span className="option-icon">📍</span>
                <div>
                  <h3>Delivery Address</h3>
                  <p>{formData.address || 'No address added'}</p>
                </div>
              </div>

              <div className="option-item" onClick={() => setIsPhoneModalOpen(true)} style={{ cursor: 'pointer' }}>
                <span className="option-icon">📱</span>
                <div>
                  <h3>Phone Number</h3>
                  <p>{user.phone || 'No phone number added'}</p>
                </div>
              </div>

              <div className="option-item">
                <span className="option-icon">💳</span>
                <div>
                  <h3>Payment Methods</h3>
                  <p>Cash on Delivery (Standard)</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Address Modal */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => { setIsAddressModalOpen(false); setAddressRefresh(r => r + 1); }}
          onSave={handleAddressSave}
          initialAddress={parsedAddress}
        />

        {/* Phone Number Modal */}
        {isPhoneModalOpen && (
          <div className="address-modal-overlay" onClick={() => setIsPhoneModalOpen(false)}>
            <div className="address-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <div className="address-modal-header">
                <h2>Add Phone Number</h2>
                <button className="close-modal-btn" onClick={() => setIsPhoneModalOpen(false)}>✕</button>
              </div>
              <form onSubmit={handlePhoneSave} className="address-form">
                <div className="form-group">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        setPhoneInput(value);
                      }
                    }}
                    placeholder="Mobile Number (10 digits) *"
                    maxLength="10"
                    required
                    style={{ fontSize: '1rem', padding: '12px' }}
                  />
                </div>
                <button type="submit" className="save-address-btn">
                  Save Phone Number
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
