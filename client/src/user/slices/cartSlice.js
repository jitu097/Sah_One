import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  total: 0,
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item._id === action.payload._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
        toast.success('Quantity updated in cart');
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
        toast.success('Item added to cart');
      }
      
      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
      toast.success('Item removed from cart');
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      
      if (item) {
        if (quantity === 0) {
          state.items = state.items.filter((item) => item._id !== id);
          toast.success('Item removed from cart');
        } else {
          item.quantity = quantity;
        }
        state.total = calculateTotal(state.items);
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
