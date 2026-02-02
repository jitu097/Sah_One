import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import NotificationList from './NotificationList';
import "../styles/notification.css";
// You might need to adjust the import path for api depending on where this file is located relative to root.

export default function NotificationBell({ userId, isAdmin = false }) {
    const [isOpen, setIsOpen] = useState(false);

    // Choose the appropriate query
    const query = isAdmin ? api.notifications.getAdminUnreadCount : api.notifications.getUnreadCount;
    const args = isAdmin ? {} : { userId };

    const unreadCount = useQuery(query, args) || 0;
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!userId && !isAdmin) return null; // Don't show if not logged in (unless admin)

    return (
        <div className="notification-container" ref={containerRef}>
            <div className="notification-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
                {/* Simple bell notification icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="notification-icon"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <NotificationList
                    userId={userId}
                    isAdmin={isAdmin}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
