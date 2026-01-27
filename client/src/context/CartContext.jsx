import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();

  // Fetch cart from server
  // Pass userId explicitly since we are managing auth manually
  const cartData = useQuery(api.cart.getCart,
    currentUser ? { userId: currentUser.uid } : "skip"
  );

  const addToCartMutation = useMutation(api.cart.addToCart);
  const updateQuantityMutation = useMutation(api.cart.updateQuantity);
  const clearCartMutation = useMutation(api.cart.clearCart);

  // Helper to map strict menu item ID to cart operations
  // The backend addToCart expects itemId.
  const addToCart = async (item) => {
    console.log('[CartContext] addToCart called with item:', item);
    if (!currentUser) {
      console.warn('[CartContext] User not logged in, cannot add to cart');
      alert("Please login to add to cart");
      return;
    }

    // Resolve the correct Menu Item ID
    // UserMenu passes: { ...item, id: `${item._id}_${portionType}`, originalId: item._id, ... }
    const menuItemId = item.originalId || (item.id && item.id.includes('_') ? item.id.split('_')[0] : item.id);

    // Fallback if menuItemId is still ambiguous or missing (should be a valid ID string)
    if (!menuItemId) {
      console.error('[CartContext] Failed to resolve menuItemId from item:', item);
      alert("System Error: Could not identify item. Please try again.");
      return;
    }

    const payload = {
      userId: currentUser.uid,
      itemId: menuItemId,
      quantity: 1,
      selectedPortion: item.portionType || 'full'
    };

    console.log('[CartContext] Sending payload to database:', payload);

    try {
      await addToCartMutation(payload);
      console.log('[CartContext] Successfully added to cart');
    } catch (err) {
      console.error("[CartContext] Failed to add to cart:", err);
      alert(`Failed to add to cart: ${err.message}`);
    }
  };

  const removeFromCart = async (cartItemId) => {
    // In the new system, we remove by CartItem ID, NOT Menu Item ID.
    // However, existing frontend calls might be passing Menu Item ID or Cart Item ID.
    // My getCart returns items with `id` as CartItem ID.
    // So if the UI iterates over `cartItems`, it uses `item.id`.
    try {
      await updateQuantityMutation({ cartItemId: cartItemId, quantity: 0 });
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const updateQuantity = async (cartItemId, change) => {
    // We need the current quantity to calculate new quantity.
    // But `updateQuantity` backend mutation takes absolute `quantity`.
    // The frontend helper `updateQuantity` takes `change` (+1 / -1).
    if (!cartData) return;

    const item = cartData.items.find(i => i.id === cartItemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    try {
      if (newQuantity <= 0) {
        await updateQuantityMutation({ cartItemId: cartItemId, quantity: 0 }); // Delete
      } else {
        await updateQuantityMutation({ cartItemId: cartItemId, quantity: newQuantity });
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;
    try {
      await clearCartMutation({ userId: currentUser.uid });
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const cartItems = cartData?.items || [];

  const applyCouponMutation = useMutation(api.cart.applyCoupon);
  const removeCouponMutation = useMutation(api.cart.removeCoupon);

  const applyCoupon = async (code) => {
    if (!currentUser) return { success: false, error: 'Please login' };
    try {
      await applyCouponMutation({ code, userId: currentUser.uid });
      return { success: true };
    } catch (err) {
      console.error("Failed to apply coupon:", err);
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = async () => {
    if (!currentUser) return;
    try {
      await removeCouponMutation({ userId: currentUser.uid });
    } catch (err) {
      console.error("Failed to remove coupon:", err);
    }
  };

  // Calculations come from server now
  const getCartTotal = () => cartData?.total || 0;
  const getCartSubtotal = () => cartData?.subtotal || 0;
  const getCartDiscount = () => cartData?.discount || 0;
  const getCartCoupon = () => cartData?.coupon || null;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getCartSubtotal,
    getCartDiscount,
    getCartCoupon,
    isLoading: !cartData && currentUser
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
