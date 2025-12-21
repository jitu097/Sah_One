import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  TextField,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { formatCurrency } from '../../shared/utils/helpers';
import toast from 'react-hot-toast';

const mockOrder = {
  _id: 'ORD1701234567890',
  items: [
    { menuItem: { name: 'Margherita Pizza' }, quantity: 2, price: 299 },
    { menuItem: { name: 'Chicken Burger' }, quantity: 1, price: 199 },
  ],
  totalAmount: 797,
  status: 'preparing',
};

const Pickup = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order] = useState(mockOrder);
  const [otp, setOtp] = useState('');

  const handleConfirmPickup = () => {
    if (otp === '1234') {
      toast.success('Order picked up successfully');
      navigate('/delivery');
    } else {
      toast.error('Invalid OTP. Try 1234');
    }
  };

  return (
    <Container maxWidth="sm" className="pickup-container">
      <Typography variant="h4" gutterBottom>
        Pickup Order
      </Typography>

      <Card>
        <CardContent>
          <Box className="pickup-header">
            <CheckCircle className="pickup-icon" />
            <Typography variant="h6" className="order-number">
              Order #{order._id.slice(-6)}
            </Typography>
          </Box>

          <Divider className="pickup-divider" />

          <Box className="order-items-section">
            <Typography variant="subtitle2" gutterBottom>
              Order Items
            </Typography>
            {order.items.map((item, index) => (
              <Box key={index} className="order-item-row">
                <Typography variant="body2">
                  {item.menuItem?.name || 'Item'} x {item.quantity}
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider className="pickup-divider" />

          <Box className="order-total">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary">
              {formatCurrency(order.totalAmount)}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Enter Pickup OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 4-digit OTP"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleConfirmPickup}
            disabled={!otp || otp.length !== 4}
            sx={{ mt: 2 }}
          >
            Confirm Pickup
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Pickup;
