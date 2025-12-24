import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  History,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';

const DeliverySidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { text: 'Assigned Orders', icon: <LocalShipping />, path: '/delivery' },
    { text: 'Delivery Confirm', icon: <CheckCircle />, path: '/delivery/confirm' },
    { text: 'Pickup', icon: <History />, path: '/delivery/pickup' },
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

export default DeliverySidebar;
