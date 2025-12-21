import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
} from '@mui/material';
import { clearCart } from '../cartSlice';
import { formatCurrency } from '../../shared/utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    address: '',
    phone: user?.phone || '',
    paymentMethod: 'cod',
  });

  const deliveryFee = 40;
  const grandTotal = total + deliveryFee;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.address || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    // Mock order creation
    const orderId = 'ORD' + Date.now();
    toast.success(`Order placed successfully! Order ID: ${orderId}`);
    dispatch(clearCart());
    navigate('/orders');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Container maxWidth="md" className="checkout-container">
      <Typography variant="h4" gutterBottom className="page-title">
        Checkout
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card className="delivery-details-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            <TextField
              fullWidth
              label="Delivery Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={3}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
          </CardContent>
        </Card>

        <Card className="payment-method-card">
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        <Card className="order-summary-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {items.map((item) => (
              <Box key={item._id} className="summary-item">
                <Typography>
                  {item.name} x {item.quantity}
                </Typography>
                <Typography>{formatCurrency(item.price * item.quantity)}</Typography>
              </Box>
            ))}
            <Divider className="summary-divider" />
            <Box className="summary-item">
              <Typography>Subtotal</Typography>
              <Typography>{formatCurrency(total)}</Typography>
            </Box>
            <Box className="summary-item">
              <Typography>Delivery Fee</Typography>
              <Typography>{formatCurrency(deliveryFee)}</Typography>
            </Box>
            <Divider className="summary-divider" />
            <Box className="summary-total">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(grandTotal)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Button type="submit" fullWidth variant="contained" size="large" className="place-order-button">
          Place Order
        </Button>
      </form>
    </Container>
  );
};

export default Checkout;
