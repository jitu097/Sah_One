import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState({
    street: '123 Main St, Apartment 4B',
    city: 'New York',
    zipCode: '10001',
  });

  const orderTotal = 697;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    toast.success('Order placed successfully!');
    setTimeout(() => {
      navigate('/user/orders');
    }, 1500);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        Checkout
      </Typography>

      <form onSubmit={handlePlaceOrder}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Delivery Address
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="ZIP Code"
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Payment Method
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ mt: 2 }}
          >
            <FormControlLabel
              value="card"
              control={<Radio />}
              label="Credit/Debit Card"
            />
            <FormControlLabel value="upi" control={<Radio />} label="UPI" />
            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
          </RadioGroup>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight="500">₹657</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Delivery Fee</Typography>
              <Typography fontWeight="500">₹40</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="600">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="600" color="primary">
                ₹{orderTotal}
              </Typography>
            </Box>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              startIcon={<CheckCircle />}
            >
              Place Order
            </Button>
          </Box>
        </Paper>
      </form>
    </Container>
  );
};

export default Checkout;
