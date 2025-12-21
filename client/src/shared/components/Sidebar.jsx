import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Dashboard,
  Restaurant,
  LocalOffer,
  Assessment,
  ShoppingCart,
  Person,
  Home,
  LocalShipping,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
        { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
        { text: 'Menu', icon: <Restaurant />, path: '/admin/menu' },
        { text: 'Offers', icon: <LocalOffer />, path: '/admin/offers' },
        { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
      ];
    } else if (user?.role === 'delivery') {
      return [
        { text: 'Assigned Orders', icon: <LocalShipping />, path: '/delivery' },
      ];
    } else {
      return [
        { text: 'Home', icon: <Home />, path: '/' },
        { text: 'Cart', icon: <ShoppingCart />, path: '/cart' },
        { text: 'Orders', icon: <Restaurant />, path: '/orders' },
        { text: 'Profile', icon: <Person />, path: '/profile' },
      ];
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {getMenuItems().map((item, index) => (
          <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
