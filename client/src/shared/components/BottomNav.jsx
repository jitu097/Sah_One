import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Home,
  ShoppingCart,
  Restaurant,
  Person,
  Dashboard,
  LocalShipping,
} from '@mui/icons-material';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getInitialValue = () => {
    const path = location.pathname;
    if (user?.role === 'admin') {
      if (path === '/admin') return 0;
      if (path === '/admin/orders') return 1;
      if (path === '/admin/menu') return 2;
      return 0;
    } else if (user?.role === 'delivery') {
      if (path === '/delivery') return 0;
      return 0;
    } else {
      if (path === '/') return 0;
      if (path === '/cart') return 1;
      if (path === '/orders') return 2;
      if (path === '/profile') return 3;
      return 0;
    }
  };

  const [value, setValue] = useState(getInitialValue());

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if (user?.role === 'admin') {
      const adminRoutes = ['/admin', '/admin/orders', '/admin/menu'];
      navigate(adminRoutes[newValue]);
    } else if (user?.role === 'delivery') {
      navigate('/delivery');
    } else {
      const userRoutes = ['/', '/cart', '/orders', '/profile'];
      navigate(userRoutes[newValue]);
    }
  };

  const getUserNavItems = () => [
    { label: 'Home', icon: <Home /> },
    { label: 'Cart', icon: <ShoppingCart /> },
    { label: 'Orders', icon: <Restaurant /> },
    { label: 'Profile', icon: <Person /> },
  ];

  const getAdminNavItems = () => [
    { label: 'Dashboard', icon: <Dashboard /> },
    { label: 'Orders', icon: <Restaurant /> },
    { label: 'Menu', icon: <Restaurant /> },
  ];

  const getDeliveryNavItems = () => [
    { label: 'Orders', icon: <LocalShipping /> },
  ];

  const getNavItems = () => {
    if (user?.role === 'admin') return getAdminNavItems();
    if (user?.role === 'delivery') return getDeliveryNavItems();
    return getUserNavItems();
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', md: 'none' } }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        {getNavItems().map((item, index) => (
          <BottomNavigationAction key={index} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
