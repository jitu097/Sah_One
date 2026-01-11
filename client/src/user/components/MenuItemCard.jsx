import React from 'react';
import '../styles/MenuItemCard.css';

export default function MenuItemCard({ item, onAddToCart, quantity, onUpdateQuantity, showCategory = true }) {
  return (
    <div className="menu-item-card menu-card-v2">
      <div className="menu-item-image-wrapper">
        <img
          src={item.image || '/image.png'}
          alt={item.name}
          onError={(e) => e.target.src = '/image.png'}
        />
      </div>
      
      <div className="menu-item-content">
        <h3 className="menu-item-name">{item.name}</h3>
        
        {showCategory && item.category && (
          <p className="menu-item-category">{item.category}</p>
        )}
        
        {item.description && (
          <p className="menu-item-description">{item.description}</p>
        )}
        
        <div className="menu-item-footer">
          <p className="menu-item-price">₹{item.fullPrice}</p>
          
          {quantity !== undefined && onUpdateQuantity ? (
            // Show quantity controls if quantity is provided
            quantity === 0 ? (
              <button 
                className="add-to-cart-btn"
                onClick={() => onAddToCart && onAddToCart(item)}
              >
                Add to Cart
              </button>
            ) : (
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item._id, -1)}
                >
                  −
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item._id, 1)}
                >
                  +
                </button>
              </div>
            )
          ) : (
            // Simple add to cart button
            <button 
              className="add-to-cart-btn"
              onClick={() => onAddToCart && onAddToCart(item)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
