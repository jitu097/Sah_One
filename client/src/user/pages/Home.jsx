import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { addToCart } from '../cartSlice';
import { formatCurrency } from '../../shared/utils/helpers';

// Mock menu data
const mockMenuItems = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella, and basil',
    price: 299,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
    isAvailable: true,
  },
  {
    _id: '2',
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken with lettuce, tomato, and special sauce',
    price: 199,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    isAvailable: true,
  },
  {
    _id: '3',
    name: 'Veg Biryani',
    description: 'Aromatic basmati rice with mixed vegetables and spices',
    price: 249,
    category: 'biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300',
    isAvailable: true,
  },
  {
    _id: '4',
    name: 'Pasta Alfredo',
    description: 'Creamy alfredo sauce with fettuccine pasta',
    price: 279,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300',
    isAvailable: true,
  },
  {
    _id: '5',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 149,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
    isAvailable: true,
  },
  {
    _id: '6',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with vanilla ice cream',
    price: 129,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=300',
    isAvailable: true,
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = mockMenuItems.map(item => item.category);
    return ['all', ...new Set(cats)];
  }, []);

  const filteredItems = useMemo(() => {
    return mockMenuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.isAvailable;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <Container maxWidth="lg" className="home-container">
      <Typography variant="h4" gutterBottom className="page-title">
        Explore Our Menu
      </Typography>

      <TextField
        fullWidth
        placeholder="Search for dishes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-field"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Box className="category-chips">
        {categories.map((category) => (
          <Chip
            key={category}
            label={category.charAt(0).toUpperCase() + category.slice(1)}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? 'primary' : 'default'}
            className="category-chip"
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card className="menu-item-card">
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
                className="menu-item-image"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="item-description">
                  {item.description}
                </Typography>
                <Box className="item-footer">
                  <Typography variant="h6" color="primary">
                    {formatCurrency(item.price)}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleAddToCart(item)}
                    className="add-to-cart-button"
                  >
                    <Add />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Box className="no-items-message">
          <Typography variant="h6" color="text.secondary">
            No items found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;
