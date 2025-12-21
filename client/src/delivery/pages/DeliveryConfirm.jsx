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
import { CheckCircle, LocationOn } from '@mui/icons-material';
import { formatCurrency } from '../../shared/utils/helpers';
import toast from 'react-hot-toast';

const mockOrder = {
  _id: 'ORD1701234567891',
  user: { name: 'Jane Smith' },
  phone: '+91 9876543211',
  deliveryAddress: '456 Park Ave, Mumbai, 400002',
  items: [
    { menuItem: { name: 'Veg Noodles' }, quantity: 1, price: 149 },
  ],
  totalAmount: 149,
  status: 'out_for_delivery',
};

const DeliveryConfirm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order] = useState(mockOrder);
  const [otp, setOtp] = useState('');

  const handleConfirmDelivery = () => {
    if (otp === '5678') {
      toast.success('Order delivered successfully');
      navigate('/delivery');
    } else {
      toast.error('Invalid OTP. Try 5678');
    }
  };

  return (
    <Container maxWidth="sm" className="delivery-confirm-container">
      <Typography variant="h4" gutterBottom>
        Confirm Delivery
      </Typography>

      <Card className="delivery-info-card">
        <CardContent>
          <Box className="delivery-address-section">
            <LocationOn color="primary" />
            <Box>
              <Typography variant="subtitle2">Delivery Address</Typography>
              <Typography variant="body2">{order.deliveryAddress}</Typography>
            </Box>
          </Box>

          <Divider className="delivery-divider" />

          <Box className="customer-details">
            <Typography variant="subtitle2" gutterBottom>
              Customer Details
            </Typography>
            <Typography variant="body2">Name: {order.user?.name || 'N/A'}</Typography>
            <Typography variant="body2">Phone: {order.phone}</Typography>
          </Box>

          <Divider className="delivery-divider" />

          <Box className="delivery-items">
            <Typography variant="subtitle2" gutterBottom>
              Order Items
            </Typography>
            {order.items.map((item, index) => (
              <Box key={index} className="delivery-item-row">
                <Typography variant="body2">
                  {item.menuItem?.name || 'Item'} x {item.quantity}
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider className="delivery-divider" />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Amount to Collect</Typography>
            <Typography variant="h6" color="primary">
              {formatCurrency(order.totalAmount)}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Payment Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Ready to Deliver
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Enter Delivery OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 4-digit OTP from customer"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            color="success"
            onClick={handleConfirmDelivery}
            disabled={!otp || otp.length !== 4}
            sx={{ mt: 2 }}
          >
            Confirm Delivery
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DeliveryConfirm;
