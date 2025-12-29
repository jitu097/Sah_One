import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import '../styles/Lunch.css';

export default function Lunch() {
  const lunchItems = [
    {
      id: 1,
      name: 'Rice Thali',
      image: '/ricethali.jpeg',
      description: 'Complete meal with rice, dal, vegetables, roti and dessert',
      price: '₹150'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="lunch-container">
          <div className="lunch-header">
            <h1>Lunch Menu</h1>
            <span className="time-badge">Available: 1pm to 4pm</span>
          </div>
          
          <div className="lunch-grid">
            {lunchItems.map(item => (
              <div key={item.id} className="lunch-card">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="lunch-card-image"
                />
                <div className="lunch-card-content">
                  <h3 className="lunch-card-title">{item.name}</h3>
                  <p className="lunch-card-description">{item.description}</p>
                  <div className="lunch-card-footer">
                    <span className="lunch-price">{item.price}</span>
                    <button className="lunch-add-btn">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}