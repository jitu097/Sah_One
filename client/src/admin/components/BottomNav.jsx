import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  Restaurant,
  LocalOffer,
} from '@mui/icons-material';

const AdminBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialValue = () => {
    const path = location.pathname;
    if (path === '/admin') return 0;
    if (path === '/admin/orders') return 1;
    if (path === '/admin/menu') return 2;
    if (path === '/admin/offers') return 3;
    return 0;
  };

  const [value, setValue] = useState(getInitialValue());

  useEffect(() => {
    setValue(getInitialValue());
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const routes = ['/admin', '/admin/orders', '/admin/menu', '/admin/offers'];
    navigate(routes[newValue]);
  };

  const navItems = [
    { label: 'Dashboard', icon: <Dashboard /> },
    { label: 'Orders', icon: <ShoppingCart /> },
    { label: 'Menu', icon: <Restaurant /> },
    { label: 'Offers', icon: <LocalOffer /> },
  ];

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', md: 'none' } }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        {navItems.map((item, index) => (
          <BottomNavigationAction key={index} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default AdminBottomNav;
