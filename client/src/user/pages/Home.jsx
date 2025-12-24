import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Star,
  LocalOffer,
  Receipt,
  Person,
} from '@mui/icons-material';
import { MOCK_MENU_ITEMS } from '../utils/mockData';

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Pizza', 'Burgers', 'Chinese', 'Indian', 'Salads', 'Beverages'];

  const filteredItems = MOCK_MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const quickActions = [
    { icon: <ShoppingCart />, label: 'Cart', path: '/user/cart', color: '#667eea' },
    { icon: <Receipt />, label: 'Orders', path: '/user/orders', color: '#f093fb' },
    { icon: <LocalOffer />, label: 'Offers', path: '/user/offers', color: '#4facfe' },
    { icon: <Person />, label: 'Profile', path: '/user/profile', color: '#43e97b' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Welcome back, {user?.name || 'Guest'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          What would you like to order today?
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: action.color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: action.color,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="body2" fontWeight="500">
                  {action.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search for food..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* Categories */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? 'primary' : 'default'}
            variant={selectedCategory === category ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      {/* Menu Items */}
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Popular Dishes
      </Typography>
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <Star sx={{ color: '#ffc107', fontSize: 18 }} />
                  <Typography variant="body2" fontWeight="500">
                    {item.rating}
                  </Typography>
                  <Chip label={item.category} size="small" sx={{ ml: 'auto' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6" fontWeight="700" color="primary">
                    ₹{item.price}
                  </Typography>
                  <Button variant="contained" size="small" startIcon={<ShoppingCart />}>
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No items found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UserHome;
