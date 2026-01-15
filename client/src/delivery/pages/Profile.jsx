import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function Profile() {
    const { currentUser } = useAuth();
    const deliveryPerson = useQuery(api.modules.delivery.delivery.getDeliveryPersonByFirebaseUid,
        currentUser ? { firebaseUid: currentUser.uid } : "skip"
    );

    const updateAvailability = useMutation(api.modules.delivery.delivery.updateAvailability);

    const toggleAvailability = async () => {
        if (!deliveryPerson) return;
        await updateAvailability({
            deliveryPersonId: deliveryPerson._id,
            isAvailable: !deliveryPerson.isAvailable
        });
    };

    if (!currentUser || !deliveryPerson) return <div className="delivery-loading">Loading Profile...</div>;

    return (
        <>
            <Navbar />
            <div className="delivery-container">
                <div className="delivery-header">
                    <h1>My Profile</h1>
                </div>

                <div className="detail-card">
                    <div className="detail-row">
                        <span className="label">Name</span>
                        <span className="value">{deliveryPerson.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Email</span>
                        <span className="value">{deliveryPerson.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Phone</span>
                        <span className="value">{deliveryPerson.phone}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Status</span>
                        <span className={`value ${deliveryPerson.isAvailable ? 'text-success' : 'text-danger'}`}>
                            {deliveryPerson.isAvailable ? 'Available for Orders' : 'Off Duty'}
                        </span>
                    </div>

                    <button
                        className={`btn-complete-delivery ${deliveryPerson.isAvailable ? 'bg-danger' : 'bg-success'}`}
                        style={{ background: deliveryPerson.isAvailable ? '#e03131' : '#0ca678', color: 'white' }}
                        onClick={toggleAvailability}
                    >
                        {deliveryPerson.isAvailable ? 'Go Offline' : 'Go Online'}
                    </button>
                </div>
            </div>
        </>
    );
}
