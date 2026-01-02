import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';
import '../styles/Lunch.css';

export default function Lunch() {
  const { addToCart, cartItems, updateQuantity } = useCart();

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Check if restaurant is open
  const isRestaurantOpen = () => {
    const savedStatus = localStorage.getItem('restaurantOpen');
    return savedStatus !== null ? savedStatus === 'true' : true;
  };

  // Handle add to cart with restaurant status check
  const handleAddToCart = (item) => {
    if (!isRestaurantOpen()) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    addToCart(item);
  };

  // Handle quantity update with restaurant status check
  const handleUpdateQuantity = (itemId, change) => {
    if (!isRestaurantOpen() && change > 0) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    updateQuantity(itemId, change);
  };

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
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <span className="quantity-display">{getItemQuantity(item.id)}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="lunch-add-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    )}
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