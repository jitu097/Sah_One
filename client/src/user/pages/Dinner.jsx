import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';
import '../styles/Dinner.css';

export default function Dinner() {
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

  const dinnerItems = [
    {
      id: 11,
      name: 'Dal Fry',
      image: '/dalfry.jpeg',
      description: 'Tempered yellow lentils with aromatic spices',
      price: '₹100'
    },
    {
      id: 12,
      name: 'Paneer Butter Masala',
      image: '/paneerbuttermasala.jpeg',
      description: 'Cottage cheese in rich tomato gravy',
      price: '₹180'
    },
    {
      id: 13,
      name: 'Veg Biryani',
      image: '/vegbiryani.jpeg',
      description: 'Aromatic basmati rice with mixed vegetables',
      price: '₹150'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="dinner-container">
          <div className="dinner-header">
            <h1>Dinner Menu</h1>
            <span className="time-badge">Available: 9pm to 11pm</span>
          </div>
          
          <div className="dinner-grid">
            {dinnerItems.map(item => (
              <div key={item.id} className="dinner-card">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="dinner-card-image"
                />
                <div className="dinner-card-content">
                  <h3 className="dinner-card-title">{item.name}</h3>
                  <p className="dinner-card-description">{item.description}</p>
                  <div className="dinner-card-footer">
                    <span className="dinner-price">{item.price}</span>
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
                        className="dinner-add-btn"
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