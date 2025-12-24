import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Avatar } from '@mui/material';
import { Notifications, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DeliveryNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'D';

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'success.main' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: 'none' } }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/delivery')}
        >
          Sah One - Delivery
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Avatar
            sx={{ bgcolor: 'secondary.main', cursor: 'pointer' }}
            onClick={() => navigate('/delivery/profile')}
          >
            {userInitial}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DeliveryNavbar;
