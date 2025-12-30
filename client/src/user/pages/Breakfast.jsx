import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';
import '../styles/Breakfast.css';

export default function Breakfast() {
  const { addToCart, cartItems, updateQuantity } = useCart();

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const breakfastItems = [
    {
      id: 1,
      name: 'Bhujia Roti',
      image: '/bhujia roti.jpeg',
      description: 'Delicious traditional bhujia with fresh roti',
      price: '₹80'
    },
    {
      id: 2,
      name: 'Chola Bhatura',
      image: '/chola bhatura.jpeg',
      description: 'Fluffy bhatura served with spicy chola',
      price: '₹120'
    },
    {
      id: 3,
      name: 'Chola',
      image: '/chola.jpeg',
      description: 'Spicy and tangy chickpea curry',
      price: '₹60'
    },
    {
      id: 4,
      name: 'Egg Paratha',
      image: '/eggpratha.jpeg',
      description: 'Paratha stuffed with egg and spices',
      price: '₹90'
    },
    {
      id: 5,
      name: 'Poha',
      image: '/poha.jpeg',
      description: 'Light and flavorful flattened rice dish',
      price: '₹50'
    },
    {
      id: 6,
      name: 'Tadka Roti',
      image: '/tadkaroti.jpeg',
      description: 'Crispy roti with special tadka seasoning',
      price: '₹70'
    },
    {
      id: 7,
      name: 'Sattu Paratha',
      image: '/sattu paratha.jpeg',
      description: 'Nutritious paratha filled with roasted gram flour',
      price: '₹85'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="breakfast-container">
          <div className="breakfast-header">
            <h1>Breakfast Menu</h1>
            <span className="time-badge">Available: 9am to 11am</span>
          </div>
          
          <div className="breakfast-grid">
            {breakfastItems.map(item => (
              <div key={item.id} className="breakfast-card">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="breakfast-card-image"
                />
                <div className="breakfast-card-content">
                  <h3 className="breakfast-card-title">{item.name}</h3>
                  <p className="breakfast-card-description">{item.description}</p>
                  <div className="breakfast-card-footer">
                    <span className="breakfast-price">{item.price}</span>
                    {getItemQuantity(item.id) === 0 ? (
                      <button 
                        className="breakfast-add-btn"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="quantity-controls">
                        <button 
                          className="qty-control-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="qty-display">{getItemQuantity(item.id)}</span>
                        <button 
                          className="qty-control-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
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