import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="landing-page">
      <div className={`landing-content ${show ? 'show' : ''}`}>
        <div className="logo-container">
          <div className="landing-logo">🍔</div>
        </div>
        
        <h1 className="landing-title">Sah One</h1>
        <p className="landing-subtitle">Your Favorite Food Delivery App</p>
        
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
