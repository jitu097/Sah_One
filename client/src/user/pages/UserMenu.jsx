import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';
import '../styles/UserMenu.css';

export default function UserMenu() {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch data from Convex
  const allMenuItems = useQuery(api.modules.menu.menu.getAvailableMenuItems);
  const categoriesList = useQuery(api.modules.menu.menu.getCategoryNames);

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
    // Convert Convex ID to string if needed or ensure CartContext handles it
    addToCart({ ...item, id: item._id });
  };

  // Handle quantity update with restaurant status check
  const handleUpdateQuantity = (itemId, change) => {
    if (!isRestaurantOpen() && change > 0) {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    updateQuantity(itemId, change);
  };

  // Loading state
  if (!allMenuItems || !categoriesList) {
    return <div className="loading-spinner">Loading menu...</div>;
  }

  const categories = ['All', ...categoriesList];

  const filteredItems = selectedCategory === 'All'
    ? allMenuItems
    : allMenuItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="menu-page-container">
          <div className="menu-page-header">
            <h1>🍽️ Our Menu</h1>
            <p>Browse our complete menu selection</p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="menu-items-grid">
            {filteredItems.map(item => (
              <div key={item._id} className="menu-item-card">
                <div className="category-badge">{item.category}</div>
                <img
                  src={item.image || '/image.png'}
                  alt={item.name}
                  className="menu-item-image"
                  onError={(e) => e.target.src = '/image.png'}
                />
                <div className="menu-item-content">
                  <h3 className="menu-item-title">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-footer">
                    <span className="menu-item-price">₹{item.fullPrice}</span>
                    {getItemQuantity(item._id) === 0 ? (
                      <button
                        className="menu-add-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item._id, -1)}
                        >
                          −
                        </button>
                        <span className="qty-number">{getItemQuantity(item._id)}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item._id, 1)}
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
