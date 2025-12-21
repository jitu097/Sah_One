import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { formatCurrency } from '../../shared/utils/helpers';
import toast from 'react-hot-toast';

const mockMenuItems = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 299,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    isAvailable: true,
  },
  {
    _id: '2',
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with lettuce, tomato, and special sauce',
    price: 199,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    isAvailable: true,
  },
  {
    _id: '3',
    name: 'Veg Noodles',
    description: 'Stir-fried noodles with fresh vegetables',
    price: 149,
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
    isAvailable: true,
  },
  {
    _id: '4',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese with spices',
    price: 249,
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
    isAvailable: true,
  },
  {
    _id: '5',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan and croutons',
    price: 179,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    isAvailable: false,
  },
  {
    _id: '6',
    name: 'Chocolate Shake',
    description: 'Rich chocolate milkshake topped with whipped cream',
    price: 129,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    isAvailable: true,
  },
];

const Menu = () => {
  const [items, setItems] = useState(mockMenuItems);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true,
  });

  const handleOpen = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        isAvailable: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      setItems(prevItems => 
        prevItems.map(item => 
          item._id === editingItem._id ? { ...item, ...formData } : item
        )
      );
      toast.success('Menu item updated');
    } else {
      const newItem = {
        ...formData,
        _id: Date.now().toString(),
        price: Number(formData.price),
      };
      setItems(prevItems => [...prevItems, newItem]);
      toast.success('Menu item added');
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prevItems => prevItems.filter(item => item._id !== id));
      toast.success('Menu item deleted');
    }
  };

  return (
    <Container maxWidth="lg" className="menu-management-container">
      <Box className="menu-header">
        <Typography variant="h4">
          Manage Menu
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.image || 'https://via.placeholder.com/300x200'}
                alt={item.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="item-description">
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" className="item-price">
                  {formatCurrency(item.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {item.category}
                </Typography>
                <Typography variant="body2" color={item.isAvailable ? 'success.main' : 'error.main'}>
                  {item.isAvailable ? 'Available' : 'Not Available'}
                </Typography>
                <Box className="item-actions">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(item)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  name="isAvailable"
                />
              }
              label="Available"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Menu;
