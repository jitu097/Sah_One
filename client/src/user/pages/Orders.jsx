import { useMemo } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { formatCurrency, formatDateTime, getOrderStatusColor } from '../../shared/utils/helpers';

// Mock orders data
const mockOrders = [
  {
    _id: 'ORD1701234567890',
    status: 'delivered',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { menuItem: { name: 'Margherita Pizza' }, quantity: 2, price: 299 },
      { menuItem: { name: 'Caesar Salad' }, quantity: 1, price: 149 },
    ],
    totalAmount: 747,
    deliveryAddress: '123 Main Street, Apartment 4B, New York, NY 10001',
  },
  {
    _id: 'ORD1701234567891',
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    items: [
      { menuItem: { name: 'Chicken Burger' }, quantity: 1, price: 199 },
      { menuItem: { name: 'Chocolate Brownie' }, quantity: 2, price: 129 },
    ],
    totalAmount: 497,
    deliveryAddress: '456 Park Avenue, Suite 12, Brooklyn, NY 11201',
  },
  {
    _id: 'ORD1701234567892',
    status: 'preparing',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    items: [
      { menuItem: { name: 'Veg Biryani' }, quantity: 3, price: 249 },
    ],
    totalAmount: 787,
    deliveryAddress: '789 Broadway, Floor 3, Manhattan, NY 10003',
  },
];

const Orders = () => {
  const orders = useMemo(() => mockOrders, []);

  return (
    <Container maxWidth="md" className="orders-container">
      <Typography variant="h4" gutterBottom className="page-title">
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Box className="no-orders-message">
          <Typography variant="h6" color="text.secondary">
            No orders yet
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card className="order-card">
                <CardContent>
                  <Box className="order-header">
                    <Typography variant="h6">Order #{order._id.slice(-6)}</Typography>
                    <Chip
                      label={order.status.replace('_', ' ').toUpperCase()}
                      color={getOrderStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatDateTime(order.createdAt)}
                  </Typography>

                  <Divider className="order-divider" />

                  {order.items.map((item, index) => (
                    <Box key={index} className="order-item">
                      <Typography>
                        {item.menuItem?.name || 'Item'} x {item.quantity}
                        <Typography component="span" className="item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </Typography>
                      </Typography>
                    </Box>
                  ))}

                  <Divider className="order-divider" />

                  <Box className="order-total">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" className="delivery-address">
                    Delivery Address: {order.deliveryAddress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders;
