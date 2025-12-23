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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { CheckCircle, ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';

const Pickup = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [verified, setVerified] = useState(false);

  const orderDetails = {
    id: orderId,
    restaurant: 'Sah One Restaurant',
    address: 'Downtown, Main Street',
    items: [
      { name: 'Margherita Pizza', quantity: 2 },
      { name: 'Mango Smoothie', quantity: 1 },
    ],
    totalAmount: 697,
  };

  const handlePickup = () => {
    if (!verified) {
      toast.error('Please verify all items');
      return;
    }
    toast.success('Order picked up successfully!');
    navigate('/delivery');
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
        Pickup Order
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Order #{orderDetails.id}
        </Typography>

        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Pickup Location
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {orderDetails.restaurant}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {orderDetails.address}
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Order Items
            </Typography>
            {orderDetails.items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: index < orderDetails.items.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2">{item.name}</Typography>
                <Typography variant="body2" fontWeight="500">
                  x{item.quantity}
                </Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body1" fontWeight="600">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="700" color="primary">
                ₹{orderDetails.totalAmount}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <FormControlLabel
          control={
            <Checkbox
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
          }
          label="I have verified all items in the order"
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<CheckCircle />}
          onClick={handlePickup}
          sx={{ mt: 2 }}
        >
          Confirm Pickup
        </Button>
      </Paper>
    </Container>
  );
};

export default Pickup;
