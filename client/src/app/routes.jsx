import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Landing Page
import LandingPage from './pages/LandingPage';

// Authentication Pages
import Login from '../auth/Login';
import Signup from '../auth/Signup';

// User Pages
import UserHome from '../user/pages/Home';
import Cart from '../user/pages/Cart';
import Checkout from '../user/pages/Checkout';
import UserOrders from '../user/pages/Orders';
import UserProfile from '../user/pages/Profile';

// Admin Pages
import AdminDashboard from '../admin/pages/Dashboard';
import AdminOrders from '../admin/pages/Orders';
import AdminMenu from '../admin/pages/Menu';
import AdminOffers from '../admin/pages/Offers';
import AdminReports from '../admin/pages/Reports';

// Delivery Pages
import AssignedOrders from '../delivery/pages/AssignedOrders';
import Pickup from '../delivery/pages/Pickup';
import DeliveryConfirm from '../delivery/pages/DeliveryConfirm';

/**
 * Main routing configuration for the Sah One app
 * Flow: Landing Page (/) → Login (/login) → User Dashboard (/user)
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page - First page users see */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication routes - Login and Signup */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User routes - For customers ordering food */}
      <Route path="/user" element={<UserHome />} />
      <Route path="/user/cart" element={<Cart />} />
      <Route path="/user/checkout" element={<Checkout />} />
      <Route path="/user/orders" element={<UserOrders />} />
      <Route path="/user/profile" element={<UserProfile />} />

      {/* Admin routes - For restaurant management */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/menu" element={<AdminMenu />} />
      <Route path="/admin/offers" element={<AdminOffers />} />
      <Route path="/admin/reports" element={<AdminReports />} />

      {/* Delivery routes - For delivery personnel */}
      <Route path="/delivery" element={<AssignedOrders />} />
      <Route path="/delivery/pickup/:orderId" element={<Pickup />} />
      <Route path="/delivery/confirm/:orderId" element={<DeliveryConfirm />} />

      {/* Catch all route - Redirect unknown URLs to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
