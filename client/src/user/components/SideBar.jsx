import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../styles/SideBar.css";

export default function SideBar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, currentUser } = useAuth();

  const menu = [
    { path: "/user", icon: "🏠", label: "Home" },
    { path: "/user/offers", icon: "🎁", label: "Offers" },
    { path: "/user/orders", icon: "📦", label: "Orders" },
    { path: "/user/cart", icon: "🛒", label: "Cart" },
    { path: "/user/profile", icon: "👤", label: "Profile" },
    { path: "/user/profile", icon: "⚙️", label: "Settings" },
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
          <div className="profile-section">
            <div className="profile-icon">
              <img src="/user.png" alt="Profile" />
            </div>
            <div className="profile-info">
              <h3>Welcome{currentUser?.displayName ? `, ${currentUser.displayName}` : ''}!</h3>
              <p>Enjoy your meal</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item) => (
            <Link
              key={item.path}
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
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
