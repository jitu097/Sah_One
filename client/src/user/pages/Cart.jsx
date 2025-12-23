import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Margherita Pizza',
      price: 299,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200',
    },
    {
      id: '2',
      name: 'Chicken Burger',
      price: 199,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
    },
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Button variant="contained" onClick={() => navigate('/user')} sx={{ mt: 2 }}>
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            {cartItems.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="600">
                      {item.name}
                    </Typography>
                    <Typography variant="body1" color="primary" fontWeight="600" sx={{ mt: 1 }}>
                      ₹{item.price}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}>
                        <Remove />
                      </IconButton>
                      <Typography fontWeight="600">{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}>
                        <Add />
                      </IconButton>
                    </Box>
                    <IconButton color="error" size="small" onClick={() => removeItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="500">₹{subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Delivery Fee</Typography>
                <Typography fontWeight="500">₹{deliveryFee}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="600" color="primary">
                  ₹{total}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/user/checkout')}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Cart;
