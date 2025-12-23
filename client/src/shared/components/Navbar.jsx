import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Avatar } from '@mui/material';
import { ShoppingCart, Notifications, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const cartItemsCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Safe user display
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userRole = user?.role || 'user';

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate(userRole === 'admin' ? '/admin' : userRole === 'delivery' ? '/delivery' : '/user')}
        >
          Sah One
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {userRole === 'user' && (
            <IconButton color="inherit" onClick={() => navigate('/user/cart')}>
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          )}

          <IconButton color="inherit">
            <Badge badgeContent={0} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={() => navigate('/user/profile')}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {userInitial}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
