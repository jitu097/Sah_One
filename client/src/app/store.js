import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import cartReducer from '../user/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
