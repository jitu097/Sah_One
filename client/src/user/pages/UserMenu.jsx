import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';
import '../styles/UserMenu.css';

export default function UserMenu() {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const allMenuItems = [
    // Breakfast Items
    {
      id: 1,
      name: 'Bhujia Roti',
      category: 'Breakfast',
      image: '/bhujia roti.jpeg',
      description: 'Delicious traditional bhujia with fresh roti',
      price: '₹80'
    },
    {
      id: 2,
      name: 'Chola Bhatura',
      category: 'Breakfast',
      image: '/chola bhatura.jpeg',
      description: 'Fluffy bhatura served with spicy chola',
      price: '₹120'
    },
    {
      id: 3,
      name: 'Chola',
      category: 'Breakfast',
      image: '/chola.jpeg',
      description: 'Spicy and tangy chickpea curry',
      price: '₹60'
    },
    {
      id: 4,
      name: 'Egg Paratha',
      category: 'Breakfast',
      image: '/eggpratha.jpeg',
      description: 'Paratha stuffed with egg and spices',
      price: '₹90'
    },
    {
      id: 5,
      name: 'Poha',
      category: 'Breakfast',
      image: '/poha.jpeg',
      description: 'Light and flavorful flattened rice dish',
      price: '₹50'
    },
    {
      id: 6,
      name: 'Tadka Roti',
      category: 'Breakfast',
      image: '/tadkaroti.jpeg',
      description: 'Crispy roti with special tadka seasoning',
      price: '₹70'
    },
    {
      id: 7,
      name: 'Sattu Paratha',
      category: 'Breakfast',
      image: '/sattu paratha.jpeg',
      description: 'Nutritious paratha filled with roasted gram flour',
      price: '₹85'
    },
    // Lunch Items
    {
      id: 8,
      name: 'Rice Thali',
      category: 'Lunch',
      image: '/ricethali.jpeg',
      description: 'Complete meal with rice, dal, vegetables, roti and dessert',
      price: '₹150'
    },
    // Dinner Items
    {
      id: 11,
      name: 'Dal Fry',
      category: 'Dinner',
      image: '/dalfry.jpeg',
      description: 'Tempered yellow lentils with aromatic spices',
      price: '₹100'
    },
    {
      id: 12,
      name: 'Paneer Butter Masala',
      category: 'Dinner',
      image: '/paneerbuttermasala.jpeg',
      description: 'Cottage cheese in rich tomato gravy',
      price: '₹180'
    },
    {
      id: 13,
      name: 'Veg Biryani',
      category: 'Dinner',
      image: '/vegbiryani.jpeg',
      description: 'Aromatic basmati rice with mixed vegetables',
      price: '₹150'
    }
  ];

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

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
              <div key={item.id} className="menu-item-card">
                <div className="category-badge">{item.category}</div>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="menu-item-image"
                  onError={(e) => e.target.src = '/image.png'}
                />
                <div className="menu-item-content">
                  <h3 className="menu-item-title">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-footer">
                    <span className="menu-item-price">{item.price}</span>
                    {getItemQuantity(item.id) === 0 ? (
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
        </div>
      </div>
    </>
  );
}
