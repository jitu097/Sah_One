import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';

// Auth
import Login from '../auth/Login';

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route index element={<UserHome />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Delivery Routes */}
      <Route path="/delivery" element={<ProtectedRoute allowedRoles={['delivery']} />}>
        <Route index element={<AssignedOrders />} />
        <Route path="pickup/:orderId" element={<Pickup />} />
        <Route path="confirm/:orderId" element={<DeliveryConfirm />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
