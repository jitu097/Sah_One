import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import {
  Home,
  ShoppingCart,
  Restaurant,
  Person,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';

const UserSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/user' },
    { text: 'Cart', icon: <ShoppingCart />, path: '/user/cart' },
    { text: 'Orders', icon: <Restaurant />, path: '/user/orders' },
    { text: 'Profile', icon: <Person />, path: '/user/profile' },
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

export default UserSidebar;
