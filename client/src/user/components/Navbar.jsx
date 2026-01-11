import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";
import SideBar from "./SideBar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sync internal state with URL params (e.g. on back button)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If on a different page, navigate to home first while preserving the search param
    if (window.location.pathname !== "/user" && window.location.pathname !== "/home") {
      navigate(`/user?search=${encodeURIComponent(value)}`);
    } else {
      // Update URL params
      setSearchParams(prev => {
        if (value) {
          prev.set("search", value);
        } else {
          prev.delete("search");
        }
        return prev;
      }, { replace: true });
    }
  };


  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/user">
            <img src="/LOGO.png" alt="SAH_ONE" className="logo-img" />
          </Link>
          <span className="location">📍 Your City</span>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="nav-right">
          <Link to="/user/cart" className="cart-btn">
            <img src="/basket.png" alt="Cart" />
          </Link>
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