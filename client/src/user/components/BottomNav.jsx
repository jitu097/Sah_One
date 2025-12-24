import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Home,
  ShoppingCart,
  Restaurant,
  Person,
} from '@mui/icons-material';

const UserBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialValue = () => {
    const path = location.pathname;
    if (path === '/user' || path === '/') return 0;
    if (path === '/user/cart') return 1;
    if (path === '/user/orders') return 2;
    if (path === '/user/profile') return 3;
    return 0;
  };

  const [value, setValue] = useState(getInitialValue());

  useEffect(() => {
    setValue(getInitialValue());
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const routes = ['/user', '/user/cart', '/user/orders', '/user/profile'];
    navigate(routes[newValue]);
  };

  const navItems = [
    { label: 'Home', icon: <Home /> },
    { label: 'Cart', icon: <ShoppingCart /> },
    { label: 'Orders', icon: <Restaurant /> },
    { label: 'Profile', icon: <Person /> },
  ];
// 0
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

export default UserBottomNav;

