import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import {
  Dashboard,
  Restaurant,
  LocalOffer,
  Assessment,
  ShoppingCart,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';

const AdminSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
    { text: 'Menu', icon: <Restaurant />, path: '/admin/menu' },
    { text: 'Offers', icon: <LocalOffer />, path: '/admin/offers' },
    { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
