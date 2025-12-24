import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  History,
} from '@mui/icons-material';

const DeliveryBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialValue = () => {
    const path = location.pathname;
    if (path === '/delivery') return 0;
    if (path === '/delivery/confirm') return 1;
    if (path === '/delivery/pickup') return 2;
    return 0;
  };

  const [value, setValue] = useState(getInitialValue());

  useEffect(() => {
    setValue(getInitialValue());
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const routes = ['/delivery', '/delivery/confirm', '/delivery/pickup'];
    navigate(routes[newValue]);
  };

  const navItems = [
    { label: 'Assigned', icon: <LocalShipping /> },
    { label: 'Confirm', icon: <CheckCircle /> },
    { label: 'Pickup', icon: <History /> },
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

export default DeliveryBottomNav;
