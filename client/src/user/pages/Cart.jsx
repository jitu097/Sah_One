import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { updateQuantity, removeFromCart, clearCart } from '../cartSlice';
import { formatCurrency } from '../../shared/utils/helpers';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Browse Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <List>
            {items.map((item, index) => (
              <Box key={item._id}>
                <ListItem
                  sx={{ px: 0 }}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveItem(item._id)}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <Box sx={{ width: '100%' }}>
                    <ListItemText
                      primary={item.name}
                      secondary={formatCurrency(item.price)}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Typography variant="subtitle1" color="primary">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Subtotal</Typography>
            <Typography variant="h6">{formatCurrency(total)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Delivery Fee</Typography>
            <Typography>{formatCurrency(40)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">Total</Typography>
            <Typography variant="h5" color="primary">
              {formatCurrency(total + 40)}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Cart;
