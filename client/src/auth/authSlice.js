import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('user');
const user = savedUser ? JSON.parse(savedUser) : null;

const initialState = {
  user: user,
  isAuthenticated: !!user,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const userData = {
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.user = userData;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, updateProfile, clearError } = authSlice.actions;
export default authSlice.reducer;
