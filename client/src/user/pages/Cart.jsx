import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../styles/pages.css';

export default function Cart() {
  const { cartItems, updateQuantity } = useCart();

  // Check if restaurant is open
  const isRestaurantOpen = () => {
    const savedStatus = localStorage.getItem('restaurantOpen');
    return savedStatus !== null ? savedStatus === 'true' : true;
  };

  // Handle quantity update with restaurant status check
  const handleUpdateQuantity = (itemId, change) => {
    if (!isRestaurantOpen() && change > 0) {
      alert('⚠️ Restaurant is temporarily closed. Cannot increase item quantity.');
      return;
    }
    updateQuantity(itemId, change);
  };
  const navigate = useNavigate();
  const deliveryCharge = 50;

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' ? 
        parseInt(item.price.replace('₹', '')) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + deliveryCharge;
  };

  return (
    <>
      <div className="cart-backdrop" onClick={() => navigate(-1)}></div>
      <div className="cart-sidebar">
        <div className="cart-sidebar-header">
          <h1>🛒 My Cart</h1>
          <button className="close-cart-btn" onClick={() => navigate(-1)}>✕</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add some delicious items from our menu!</p>
              <button 
                className="browse-menu-btn"
                onClick={() => navigate('/user')}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                <div className="item-actions">
                  <button 
                    className="qty-btn" 
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="qty">{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                  <span className="item-price">
                    ₹{(typeof item.price === 'string' ? 
                      parseInt(item.price.replace('₹', '')) : item.price) * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}
