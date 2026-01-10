import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';
import '../styles/ServingHours.css';

export default function ServingHours() {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [expandedCategory, setExpandedCategory] = useState('Breakfast');

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

  // Fetch data from Convex
  const allMenuItems = useQuery(api.modules.menu.menu.getAvailableMenuItems);
  const categoriesList = useQuery(api.modules.menu.menu.getCategoryNames);

  // Static metadata for categories
  const categoryMetadata = {
    'Breakfast': { icon: '🌅', time: '9am to 11am', color: '#FF9800', order: 1 },
    'Lunch': { icon: '☀️', time: '1pm to 4pm', color: '#4CAF50', order: 2 },
    'Dinner': { icon: '🌙', time: '9pm to 12am', color: '#2196F3', order: 3 }
  };

  // Loading state
  if (!allMenuItems || !categoriesList) {
    return <div className="loading-spinner">Loading serving hours...</div>;
  }

  // Process data to match the component structure
  const categories = categoriesList
    .map((catName, index) => {
      const metadata = categoryMetadata[catName] || {
        icon: '🍽️',
        time: 'All Day',
        color: '#9E9E9E',
        order: 99
      };

      return {
        id: index, // Use index or generate stable ID
        name: catName,
        ...metadata,
        items: allMenuItems.filter(item => item.category === catName)
      };
    })
    .sort((a, b) => a.order - b.order)
    .filter(cat => cat.items.length > 0); // Only show categories with items

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="serving-hours-container">
          <div className="serving-hours-header">
            <h1>🕐 Serving Hours</h1>
            <p>Browse our menu by meal time</p>
          </div>

          <div className="category-sections">
            {categories.map(category => {
              const isExpanded = expandedCategory === category.name;

              return (
                <div key={category.id} className="meal-category">
                  <div
                    className="category-header-bar"
                    onClick={() => toggleCategory(category.name)}
                    style={{ background: category.color }}
                  >
                    <div className="category-info">
                      <span className="category-arrow">{isExpanded ? '▼' : '▶'}</span>
                      <span className="category-icon">{category.icon}</span>
                      <h2>{category.name}</h2>
                      <span className="category-time-badge">{category.time}</span>
                    </div>
                    <span className="item-count-badge">{category.items.length} items</span>
                  </div>

                  {isExpanded && (
                    <div className="category-items-grid">
                      {category.items.map(item => (
                        <div key={item._id} className="meal-card">
                          <img
                            src={item.image || '/image.png'}
                            alt={item.name}
                            className="meal-card-image"
                            onError={(e) => e.target.src = '/image.png'}
                          />
                          <div className="meal-card-content">
                            <h3 className="meal-card-title">{item.name}</h3>
                            <p className="meal-card-description">{item.description}</p>
                            <div className="meal-card-footer">
                              <span className="meal-price">₹{item.fullPrice}</span>
                              {getItemQuantity(item._id) === 0 ? (
                                <button
                                  className="meal-add-btn"
                                  onClick={() => handleAddToCart({ ...item, id: item._id })}
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
