import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import '../styles/MenuItemCard.css';

export default function MenuItemCard({ item, onAddToCart, quantity, onUpdateQuantity, showCategory = true }) {
  const { cartItems, updateQuantity: updateCartQuantity } = useCart();
  const [showPortionControls, setShowPortionControls] = useState(false);

  const handlePortionAdd = (portionType) => {
    console.log(`[MenuItemCard] Adding portion: ${portionType} for item: ${item._id}`);
    if (onAddToCart) {
      onAddToCart(item, portionType);
    } else {
      console.error('[MenuItemCard] onAddToCart prop is missing!');
    }
  };

  const handlePortionUpdate = (portionType, change) => {
    // Construct the unique ID matching how it's stored in CartContext
    // This MUST match what Home.jsx/UserMenu.jsx uses if they store composite IDs.
    // However, CartContext now tracks items by `itemId` (menu item) if strict.
    // Wait, if CartContext tracks items by CartItem ID (db ID) returned from server,
    // then `cartItems.find` by `${item._id}_${portionType}` might fail if `item.id` is the DB ID.
    // Backend `getCart` returns items with `id` = `cartItem._id` (DB ID).
    // Frontend `addToCart` generates a local optimistic update or relies on server refetch?
    // Reviewing CartContext: it fetches `cartData` from server. `item.id` is `cartItem._id`.
    // BUT `UserMenu`/`Home` logic tries to find item by constructed ID `${item._id}_${portionType}`.
    // THIS IS THE BUG. Server returns DB IDs (e.g., "cartItemId123"), but UI looks for "menuItemId_full".

    // We need to fix `getPortionQuantity` to find item by `itemId` and `selectedPortion` 
    // instead of relying on the `id` field matching the composite key.

    const qty = getPortionQuantity(portionType);

    // For update, we need the actual cartItem._id to call `updateCartQuantity`.
    // We need to find the cart item first.
    const cartItem = cartItems.find(i => i.itemId === item._id && (i.selectedPortion || 'full') === portionType);

    if (cartItem) {
      console.log(`[MenuItemCard] Updating qty for cartItem: ${cartItem.id} (Database ID)`);
      if (onUpdateQuantity) {
        // Pass the Menu ID and Portion to the parent handler
        onUpdateQuantity(item._id, portionType, change);
      } else {
        updateCartQuantity(cartItem.id, change);
      }
    } else {
      console.error(`[MenuItemCard] Cannot find cart item to update for ${item._id} ${portionType}`);
    }

    // Logic to hide controls if qty becomes 0
    if (change < 0 && qty === 1) {
      const otherPortionType = portionType === 'half' ? 'full' : 'half';
      const otherQty = getPortionQuantity(otherPortionType);
      if (otherQty === 0) {
        setShowPortionControls(false);
      }
    }
  };

  const getPortionQuantity = (portionType) => {
    // FIX: Match by itemId and portion, NOT by `id` string match
    const cartItem = cartItems.find(i => i.itemId === item._id && (i.selectedPortion || 'full') === portionType);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCartClick = () => {
    console.log('[MenuItemCard] Add to Cart Clicked');
    if (item.hasHalfPortion && item.halfPrice) {
      setShowPortionControls(true);
    } else {
      handlePortionAdd('full');
    }
  };

  const halfQty = getPortionQuantity('half');
  const fullQty = getPortionQuantity('full');
  const hasAnyInCart = halfQty > 0 || fullQty > 0;

  // If any portion is in cart, always show controls
  const shouldShowControls = showPortionControls || hasAnyInCart;

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
          {item.hasHalfPortion && item.halfPrice ? (
            shouldShowControls ? (
              // Show both portion types with quantity controls
              <div className="portion-controls-container">
                <div className="portion-row">
                  <div className="portion-info">
                    <span className="portion-label-small">Half</span>
                    <span className="portion-price-small">₹{item.halfPrice}</span>
                  </div>
                  {halfQty > 0 ? (
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => handlePortionUpdate('half', -1)}>−</button>
                      <span className="qty-number">{halfQty}</span>
                      <button className="qty-btn" onClick={() => handlePortionUpdate('half', 1)}>+</button>
                    </div>
                  ) : (
                    <button className="add-portion-btn-text" onClick={() => handlePortionAdd('half')}>Add</button>
                  )}
                </div>

                <div className="portion-row">
                  <div className="portion-info">
                    <span className="portion-label-small">Full</span>
                    <span className="portion-price-small">₹{item.fullPrice}</span>
                  </div>
                  {fullQty > 0 ? (
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => handlePortionUpdate('full', -1)}>−</button>
                      <span className="qty-number">{fullQty}</span>
                      <button className="qty-btn" onClick={() => handlePortionUpdate('full', 1)}>+</button>
                    </div>
                  ) : (
                    <button className="add-portion-btn-text" onClick={() => handlePortionAdd('full')}>Add</button>
                  )}
                </div>
              </div>
            ) : (
              // Show prices and Add to Cart button initially
              <div className="initial-price-display">
                <div className="price-info-section">
                  <div className="price-item">
                    <span className="price-label">Half:</span>
                    <span className="price-value">₹{item.halfPrice}</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">Full:</span>
                    <span className="price-value">₹{item.fullPrice}</span>
                  </div>
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
                  Add to Cart
                </button>
              </div>
            )
          ) : (
            // Single price item
            <>
              <p className="menu-item-price">₹{item.fullPrice}</p>

              {fullQty > 0 ? (
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => handlePortionUpdate('full', -1)}>−</button>
                  <span className="qty-number">{fullQty}</span>
                  <button className="qty-btn" onClick={() => handlePortionUpdate('full', 1)}>+</button>
                </div>
              ) : (
                <button className="add-to-cart-btn" onClick={() => handlePortionAdd('full')}>
                  Add to Cart
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
