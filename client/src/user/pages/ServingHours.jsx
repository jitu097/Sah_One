import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const categories = [
    {
      id: 1,
      name: 'Breakfast',
      icon: '🌅',
      time: '9am to 11am',
      color: '#FF9800',
      items: [
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
      ]
    },
    {
      id: 2,
      name: 'Lunch',
      icon: '☀️',
      time: '1pm to 4pm',
      color: '#4CAF50',
      items: [
        {
          id: 8,
          name: 'Rice Thali',
          image: '/ricethali.jpeg',
          description: 'Complete meal with rice, dal, vegetables, roti and dessert',
          price: '₹150'
        }
      ]
    },
    {
      id: 3,
      name: 'Dinner',
      icon: '🌙',
      time: '9pm to 12am',
      color: '#2196F3',
      items: [
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
      ]
    }
  ];

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
                        <div key={item.id} className="meal-card">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="meal-card-image"
                            onError={(e) => e.target.src = '/image.png'}
                          />
                          <div className="meal-card-content">
                            <h3 className="meal-card-title">{item.name}</h3>
                            <p className="meal-card-description">{item.description}</p>
                            <div className="meal-card-footer">
                              <span className="meal-price">{item.price}</span>
                              {getItemQuantity(item.id) === 0 ? (
                                <button 
                                  className="meal-add-btn"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  Add to Cart
                                </button>
                              ) : (
                                <div className="quantity-controls">
                                  <button 
                                    className="qty-btn"
                                    onClick={() => handleUpdateQuantity(item.id, -1)}
                                  >
                                    −
                                  </button>
                                  <span className="qty-number">{getItemQuantity(item.id)}</span>
                                  <button 
                                    className="qty-btn"
                                    onClick={() => handleUpdateQuantity(item.id, 1)}
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
