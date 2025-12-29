import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// App Pages
import LandingPage from './app/pages/LandingPage';
import HomePage from './app/pages/HomePage';

// Auth Pages
import Login from './auth/Login';
import Signup from './auth/Signup';

// User Pages
import UserHome from './user/pages/Home';
import Cart from './user/pages/Cart';
import UserOrders from './user/pages/Orders';
import Profile from './user/pages/Profile';
import Breakfast from './user/pages/Breakfast';
import Lunch from './user/pages/Lunch';
import Dinner from './user/pages/Dinner';

// Admin Pages
import AdminDashboard from './admin/pages/Dashboard';
import Menu from './admin/pages/Menu';
import AdminOrders from './admin/pages/Orders';
import Offers from './admin/pages/Offers';
import Reports from './admin/pages/Reports';

// Delivery Pages
import AssignedOrders from './delivery/pages/AssignedOrders';
import Pickup from './delivery/pages/Pickup';
import DeliveryConfirm from './delivery/pages/DeliveryConfirm';

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/orders" element={<UserOrders />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/breakfast" element={<Breakfast />} />
        <Route path="/user/lunch" element={<Lunch />} />
        <Route path="/user/dinner" element={<Dinner />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<Menu />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/offers" element={<Offers />} />
        <Route path="/admin/reports" element={<Reports />} />

        {/* Delivery Routes */}
        <Route path="/delivery" element={<AssignedOrders />} />
        <Route path="/delivery/pickup" element={<Pickup />} />
        <Route path="/delivery/confirm" element={<DeliveryConfirm />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
