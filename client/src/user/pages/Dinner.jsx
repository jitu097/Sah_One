import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

export default function Dinner() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Dinner Menu</h1>
          <p className="page-subtitle">Available: 9pm to 11pm</p>
        </div>
        
        <div className="menu-items-container">
          <p>Dinner menu items will be displayed here.</p>
        </div>
      </div>
    </>
  );
}