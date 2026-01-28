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

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      // Check for saved address from AddressModal
      const savedAddress = localStorage.getItem('userAddress');
      let addressText = user.address || '';
      let phoneNumber = user.phone || '';
      
      if (savedAddress) {
        const addressData = JSON.parse(savedAddress);
        addressText = `${addressData.deliveryArea}, ${addressData.locality}, ${addressData.city}`;
        phoneNumber = addressData.mobileNumber || user.phone || '';
      }
      
      setFormData({
        phone: phoneNumber,
        address: addressText,
        name: user.name || ''
      });
      setPhoneInput(phoneNumber);
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUser({
        firebaseUid: user.firebaseUid,
        phone: formData.phone,
        address: formData.address,
        name: formData.name
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAddressSave = async (addressData) => {
    const addressText = `${addressData.company}, ${addressData.locality}, ${addressData.city}`;
    const phoneNumber = addressData.mobileNumber;
    
    try {
      await updateUser({
        firebaseUid: user.firebaseUid,
        address: addressText,
        phone: phoneNumber,
        name: user.name || ''
      });
      
      // Save to localStorage
      localStorage.setItem('userAddress', JSON.stringify(addressData));
      
      setFormData(prev => ({
        ...prev,
        address: addressText,
        phone: phoneNumber
      }));
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
      await updateUser({
        firebaseUid: user.firebaseUid,
        phone: phoneInput,
        address: user.address || '',
        name: user.name || ''
      });
      
      setFormData(prev => ({
        ...prev,
        phone: phoneInput
      }));
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
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full delivery address"
                />
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
              <div className="profile-avatar">👤</div>
              <h2>{user.name || 'User'}</h2>
              <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-options">
              <div className="option-item" onClick={() => setIsAddressModalOpen(true)} style={{ cursor: 'pointer' }}>
                <span className="option-icon">📍</span>
                <div>
                  <h3>Delivery Address</h3>
                  <p>{user.address || 'No address added'}</p>
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
          onClose={() => setIsAddressModalOpen(false)}
          onSave={handleAddressSave}
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
