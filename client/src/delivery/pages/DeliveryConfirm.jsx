import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { CheckCircle, ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';

const DeliveryConfirm = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [otp, setOtp] = useState('');

  const orderDetails = {
    id: orderId,
    customerName: 'John Doe',
    address: '123 Main St, Apartment 4B, New York, NY 10001',
    phone: '+1 234 567 8900',
    totalAmount: 697,
    paymentMethod: 'Cash',
  };

  const handleDeliver = () => {
    if (orderDetails.paymentMethod === 'Cash' && !otp) {
      toast.error('Please enter delivery OTP');
      return;
    }
    toast.success('Order delivered successfully!');
    setTimeout(() => {
      navigate('/delivery');
    }, 1500);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/delivery')}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        Confirm Delivery
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Order #{orderDetails.id}
        </Typography>

        <Card variant="outlined" sx={{ my: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Customer Details
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight="500" gutterBottom>
                {orderDetails.customerName}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Phone
              </Typography>
              <Typography variant="body1" fontWeight="500" gutterBottom>
                {orderDetails.phone}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Address
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {orderDetails.address}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Payment
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label={`Cash on Delivery - ₹${orderDetails.totalAmount}`}
              />
              <FormControlLabel
                value="paid"
                control={<Radio />}
                label="Already Paid Online"
              />
            </RadioGroup>
          </CardContent>
        </Card>

        <TextField
          fullWidth
          label="Delivery OTP"
          placeholder="Enter 4-digit OTP from customer"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ mb: 3 }}
          helperText="Ask the customer for their delivery OTP"
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<CheckCircle />}
          onClick={handleDeliver}
        >
          Confirm Delivery
        </Button>
      </Paper>
    </Container>
  );
};

export default DeliveryConfirm;
