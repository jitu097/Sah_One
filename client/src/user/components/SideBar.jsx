import { Link, useLocation } from "react-router-dom";
import "../styles/SideBar.css";

export default function SideBar({ isOpen, onClose }) {
  const location = useLocation();

  const menu = [
    { path: "/", icon: "🏠", label: "Home" },
    { path: "/orders", icon: "📦", label: "Orders" },
    { path: "/cart", icon: "🛒", label: "Cart" },
    { path: "/profile", icon: "⚙️", label: "Settings" },
  ];

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
              <h3>Welcome!</h3>
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
          <button className="logout-btn">Logout</button>
        </div>
      </aside>
    </>
  );
}
