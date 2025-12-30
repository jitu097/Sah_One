import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(2);
  const pricePerItem = 12.15;
  const totalPrice = (quantity * pricePerItem).toFixed(2);



  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <img src="/LOGO.png" alt="Logo" className="nav-logo" />
        </div>
        
        <div className="navbar-center">
          <a href="#home" className="nav-item active">Home</a>
          <a href="#menu" className="nav-item">Menu</a>
          <a href="#service" className="nav-item">Service</a>
          <a href="#shop" className="nav-item">Shop</a>
        </div>

        <div className="navbar-right">
         
          <button className="auth-btn signin-btn" onClick={() => navigate('/signup')}>
            ➜ sing up
          </button>
          <button className="auth-btn login-btn" onClick={() => navigate('/login')}>
            ➜ login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Section */}
        <div className="content-left">
          <h1 className="main-heading">
            Order your<br />
            <span className="highlight-text">favourite Foods</span>
          </h1>
          
          <p className="description">
            Fresh and tasty seafood curry sit amet, consectetur<br />
            Curabitur accumsan auctor pulvinar proin <strong>sit amet.</strong>
          </p>

          <div className="order-section">
            <div className="total-order">
              <span className="label">Total order:</span>
              <span className="price">${totalPrice}</span>
            </div>

            <div className="order-controls">
              <div className="quantity-selector">
                <button onClick={decrementQuantity} className="qty-btn">▼</button>
                <span className="quantity">{quantity}</span>
                <button onClick={incrementQuantity} className="qty-btn">▲</button>
              </div>
              <button className="buy-now-btn">
                🛒 Buy Now
              </button>
            </div>
          </div>

         
        </div>

        {/* Right Section */}
        <div className="content-right">
          <div className="hero-image-container">
            <img src="/Homepage.png" alt="Delicious Salad Bowl" className="hero-food-image" />
            
           

            {/* Floating Elements */}
            <div className="floating-item tomato">🌿</div>
            <div className="floating-item pepper">🌿</div>
            <div className="floating-item herb">🌿</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;