import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import '../styles/profile.css'; // We'll need to make sure this exists or reuse user profile styles

export default function AdminProfile() {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    const adminProfile = useQuery(api.modules.auth.admins.getAdmin,
        currentUser ? { firebaseUid: currentUser.uid } : "skip"
    );

    const updateAdmin = useMutation(api.modules.auth.admins.updateAdmin);

    useEffect(() => {
        if (adminProfile) {
            setFormData({
                name: adminProfile.name || '',
                phone: adminProfile.phone || '',
                email: adminProfile.email || '',
            });
        }
    }, [adminProfile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAdmin({
                firebaseUid: currentUser.uid,
                name: formData.name,
                phone: formData.phone,
            });
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (!adminProfile) {
        return (
            <div className="admin-container">
                <Navbar />
                <div className="admin-content">
                    <div className="loading">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <Navbar />
            <div className="admin-content">
                <div className="profile-container">
                    <div className="profile-header">
                        <h1>Admin Profile</h1>
                        {!isEditing && (
                            <button
                                className="edit-profile-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="profile-card">
                        <div className="profile-avatar">
                            <div className="avatar-placeholder">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email (Read-only)</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="disabled-input"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-btn">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <div className="detail-item">
                                    <span className="detail-label">Name</span>
                                    <span className="detail-value">{adminProfile.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{adminProfile.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{adminProfile.phone || 'Not set'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Role</span>
                                    <span className="detail-value badge admin">Administrator</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Joined</span>
                                    <span className="detail-value">
                                        {new Date(adminProfile.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
