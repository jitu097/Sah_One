import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";
import SideBar from "./SideBar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img src="/LOGO.png" alt="SAH_ONE" className="logo-img" />
          <span className="location">📍 Your City</span>
        </div>

        <div className="nav-center">
          <input type="text" placeholder="Search food..." />
        </div>

        <div className="nav-right">
          <Link to="/offers">Offers</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/cart" className="cart-btn">Cart</Link>
          <img 
            src="/hamburger.png" 
            alt="Menu" 
            className="hamburger-icon" 
            onClick={toggleSidebar}
          />
        </div>
      </nav>
      <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
}