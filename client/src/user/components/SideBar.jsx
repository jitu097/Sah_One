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
    { path: "/user", icon: <img src="/k.png" alt="Home" style={{width:'28px',height:'28px'}} />, label: "Home" },
    { path: "/user/offers", icon: <img src="/u.png" alt="Offers" style={{width:'28px',height:'28px'}} />, label: "Offers" },
    { path: "/user/orders", icon: <img src="/s.png" alt="Orders" style={{width:'28px',height:'28px'}} />, label: "Orders" },
    { path: "/user/bookings", icon: <img src="/h.png" alt="My Bookings" style={{width:'28px',height:'28px'}} />, label: "My Bookings" },
    { path: "/user/cart", icon: <img src="/a.png" alt="Cart" style={{width:'28px',height:'28px'}} />, label: "Cart" },
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
