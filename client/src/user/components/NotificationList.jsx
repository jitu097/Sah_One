import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import "../styles/notification.css";

export default function NotificationList({ onClose, userId, isAdmin = false }) {
    const navigate = useNavigate();
    
    // Emoji mapping for notification types
    const getTypeEmoji = (type) => {
        const emojiMap = {
            order: '📦',
            booking: '📅',
            payment: '🧾',
            offer: '🎉',
            system: '⚙️',
        };
        return emojiMap[type] || '🔔';
    };
    
    // Choose appropriate queries/mutations
    const listQuery = isAdmin ? api.notifications.getAdminNotifications : api.notifications.getUserNotifications;
    const listArgs = isAdmin ? {} : { userId };

    const markAllMutation = isAdmin ? api.notifications.markAdminAllAsRead : api.notifications.markAllAsRead;

    const notifications = useQuery(listQuery, listArgs);
    const markAllAsRead = useMutation(markAllMutation);
    const markAsRead = useMutation(api.notifications.markAsRead);

    // If userId is missing and not admin, typically means not logged in
    if (!userId && !isAdmin) return null;

    const handleMarkAllRead = async () => {
        await markAllAsRead(isAdmin ? {} : { userId });
    };

    const handleNotificationClick = async (notif) => {
        // Mark as read
        if (!notif.isRead) {
            await markAsRead({ notificationId: notif._id });
        }
        
        // Handle redirect based on type and referenceId
        if (notif.referenceId) {
            if (isAdmin) {
                // Admin redirects
                if (notif.type === 'order') {
                    navigate('/admin/orders');
                } else if (notif.type === 'booking') {
                    navigate('/admin/bookings');
                }
            } else {
                // User redirects
                if (notif.type === 'order') {
                    navigate('/user/orders');
                } else if (notif.type === 'booking') {
                    navigate('/user/bookings');
                }
            }
        }
        
        // Close dropdown after click
        if (onClose) onClose();
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than a minute
        if (diff < 60000) return 'Just now';
        // Less than an hour
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        // Less than a day
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        // default
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="notification-header">
                <h3>Notifications</h3>
                <button className="mark-read-btn" onClick={handleMarkAllRead}>
                    Mark all as read
                </button>
            </div>

            <div className="notification-list">
                {!notifications ? (
                    <div className="notification-empty">Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="notification-empty">No notifications yet</div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <div className="notif-icon-section">
                                <span className="notif-type-emoji">{getTypeEmoji(notif.type)}</span>
                                <div className="notif-content-section">
                                    <div className="notif-top">
                                        <span className="notif-title">{notif.title}</span>
                                        <span className="notif-time">{formatTime(notif.createdAt)}</span>
                                    </div>
                                    <p className="notif-message">{notif.message}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
