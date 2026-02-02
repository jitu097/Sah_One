import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import '../../user/styles/NotificationsPage.css';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Get admin notifications
  const notifications = useQuery(api.notifications.getAdminNotifications);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAdminAllAsRead);

  // Type emoji mapping
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

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Handle notification click
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead({ notificationId: notif._id });
    }

    // Navigate based on type
    if (notif.referenceId) {
      if (notif.type === 'order') {
        navigate('/admin/orders');
      } else if (notif.type === 'booking') {
        navigate('/admin/bookings');
      } else if (notif.type === 'payment') {
        navigate('/admin/orders');
      }
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // Filter notifications
  const filteredNotifications = notifications?.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  }) || [];

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <>
      <Navbar />
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Admin Notifications</h1>
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-filter">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All {notifications && `(${notifications.length})`}
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read
          </button>
        </div>

        <div className="notifications-content">
          {!notifications ? (
            <div className="notifications-loading">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <div className="empty-icon">🔔</div>
              <h3>No {filter !== 'all' ? filter : ''} notifications</h3>
              <p>
                {filter === 'all' 
                  ? "No admin notifications yet. We'll notify you about orders, bookings, and system events."
                  : `You don't have any ${filter} notifications.`}
              </p>
            </div>
          ) : (
            <div className="notifications-list-page">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`notification-card ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="notification-card-icon">
                    <span className="type-emoji">{getTypeEmoji(notif.type)}</span>
                  </div>
                  <div className="notification-card-content">
                    <div className="notification-card-header">
                      <h3>{notif.title}</h3>
                      <span className="notification-time">{formatTime(notif.createdAt)}</span>
                    </div>
                    <p className="notification-message">{notif.message}</p>
                  </div>
                  {!notif.isRead && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
