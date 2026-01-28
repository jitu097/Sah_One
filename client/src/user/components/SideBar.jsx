import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import "../styles/SideBar.css";

export default function SideBar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, currentUser } = useAuth();

  // Fetch user data from Convex
  const user = useQuery(api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  const menu = [
    { path: "/user", icon: "🏠", label: "Home" },
    { path: "/user/offers", icon: "🎁", label: "Offers" },
    { path: "/user/orders", icon: "📦", label: "Orders" },
    { path: "/user/bookings", icon: "📅", label: "My Bookings" },
    { path: "/user/cart", icon: "🛒", label: "Cart" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}` }>
        <div className="sidebar-header">
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <img src="/user.png" alt="Profile" />
          </div>
          <div className="profile-details">
            <h2>{user?.name || user?.email?.split('@')[0] || currentUser?.email?.split('@')[0] || 'Guest'}</h2>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item, index) => (
            <Link
              key={item.path + index}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={onClose}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/user/profile" className="settings-btn" onClick={onClose}>
            <span>👤</span>
            <span>Profile</span>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
