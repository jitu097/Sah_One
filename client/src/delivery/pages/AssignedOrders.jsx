import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { LocalShipping, CheckCircle } from '@mui/icons-material';
import { formatCurrency, formatDateTime } from '../../shared/utils/helpers';

const mockAssignedOrders = [
  {
    _id: 'ORD1701234567890',
    user: {
      name: 'John Doe',
      phone: '+91 9876543210',
      address: {
        street: '123 Main St',
        city: 'Mumbai',
        zipCode: '400001',
      },
    },
    items: [
      { menuItem: { name: 'Margherita Pizza' }, quantity: 2, price: 299 },
      { menuItem: { name: 'Chicken Burger' }, quantity: 1, price: 199 },
    ],
    totalAmount: 797,
    status: 'preparing',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'ORD1701234567891',
    user: {
      name: 'Jane Smith',
      phone: '+91 9876543211',
      address: {
        street: '456 Park Ave',
        city: 'Mumbai',
        zipCode: '400002',
      },
    },
    items: [
      { menuItem: { name: 'Veg Noodles' }, quantity: 1, price: 149 },
    ],
    totalAmount: 149,
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const AssignedOrders = () => {
  const navigate = useNavigate();
  const [orders] = useState(mockAssignedOrders);

  const handlePickup = (orderId) => {
    navigate(`/delivery/pickup/${orderId}`);
  };

  const handleDelivery = (orderId) => {
    navigate(`/delivery/confirm/${orderId}`);
  };

  const getOrderActions = (order) => {
    if (order.status === 'preparing') {
      return (
        <Button
          fullWidth
          variant="contained"
          onClick={() => handlePickup(order._id)}
        >
          Ready to Pickup
        </Button>
      );
    } else if (order.status === 'out_for_delivery') {
      return (
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={() => handleDelivery(order._id)}
        >
          Confirm Delivery
        </Button>
      );
    } else if (order.status === 'delivered') {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Delivered"
          color="success"
          className="delivered-chip"
        />
      );
    }
    return null;
  };

  return (
    <Container maxWidth="md" className="assigned-orders-container">
      <Box className="delivery-header">
        <LocalShipping className="delivery-icon" />
        <Typography variant="h4">Assigned Deliveries</Typography>
      </Box>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="no-deliveries">
            <Typography variant="h6" color="text.secondary">
              No assigned deliveries
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card>
                <CardContent>
                  <Box className="order-card-header">
                    <Typography variant="h6">Order #{order._id.slice(-6)}</Typography>
                    <Chip
                      label={order.status.replace('_', ' ').toUpperCase()}
                      color={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'out_for_delivery'
                          ? 'warning'
                          : 'primary'
                      }
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatDateTime(order.createdAt)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Customer Details
                    </Typography>
                    <Typography variant="body2">
                      Name: {order.user?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {order.phone}
                    </Typography>
                    <Typography variant="body2">
                      Address: {order.deliveryAddress}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Order Items
                    </Typography>
                    {order.items.map((item, index) => (
                      <Typography key={index} variant="body2">
                        {item.menuItem?.name || 'Item'} x {item.quantity}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total Amount</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Box>

                  {getOrderActions(order)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AssignedOrders;
