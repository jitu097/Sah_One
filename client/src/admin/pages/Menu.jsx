import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { MOCK_MENU_ITEMS } from '../utils/mockData';
import toast from 'react-hot-toast';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState(MOCK_MENU_ITEMS);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast.success('Item deleted successfully');
  };

  const toggleAvailability = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    toast.success('Availability updated');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Menu Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={item.image}
                alt={item.name}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="h6" fontWeight="600">
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.isAvailable ? 'Available' : 'Unavailable'}
                    color={item.isAvailable ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" fontWeight="700" color="primary">
                    ₹{item.price}
                  </Typography>
                  <Chip label={item.category} size="small" />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => toggleAvailability(item.id)}
                  >
                    {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                  </Button>
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Item Name" margin="normal" />
          <TextField fullWidth label="Description" margin="normal" multiline rows={2} />
          <TextField fullWidth label="Price" type="number" margin="normal" />
          <TextField fullWidth label="Category" margin="normal" />
          <TextField fullWidth label="Image URL" margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenDialog(false);
              toast.success('Item added successfully');
            }}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMenu;
