import React from 'react';
import './Logo.css';

export default function Logo({ size = 'medium', showText = false, className = '' }) {
  const dimensions = {
    small: 40,
    medium: 60,
    large: 100
  };

  const svgSize = dimensions[size] || dimensions.medium;

  return (
    <div className={`logo-container ${className}`}>
      <div className="logo-icon">
        <svg 
          width={svgSize} 
          height={svgSize} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fork - rotated 45 degrees */}
          <g className="fork" transform="rotate(-45 50 50)">
            {/* Fork tines */}
            <line x1="45" y1="20" x2="45" y2="45" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="50" y1="20" x2="50" y2="45" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="55" y1="20" x2="55" y2="45" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Fork handle */}
            <rect x="47" y="45" width="6" height="35" rx="3" fill="#ff6b35"/>
            <circle cx="50" cy="77" r="3" fill="#ff6b35"/>
          </g>

          {/* Spoon - rotated -45 degrees */}
          <g className="spoon" transform="rotate(45 50 50)">
            {/* Spoon bowl */}
            <ellipse cx="50" cy="25" rx="8" ry="10" fill="#ffa500"/>
            {/* Spoon handle */}
            <rect x="47" y="35" width="6" height="40" rx="3" fill="#ffa500"/>
            <circle cx="50" cy="72" r="3" fill="#ffa500"/>
          </g>

          {/* Center decoration circle */}
          <circle className="center-dot" cx="50" cy="50" r="4" fill="#fff" stroke="#ff6b35" strokeWidth="2"/>
        </svg>
      </div>
      {showText && (
        <div className="logo-text">
          <h1>Sah One</h1>
          <p>Delicious Food Delivered</p>
        </div>
      )}
    </div>
  );
}
