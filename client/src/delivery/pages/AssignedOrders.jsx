import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import { Navigation, CheckCircle, AttachMoney, LocalShipping } from '@mui/icons-material';
import { MOCK_DELIVERY_ORDERS } from '../utils/mockData';

const AssignedOrders = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Deliveries', value: '2', icon: <LocalShipping />, color: '#667eea' },
    { label: 'Completed Today', value: '8', icon: <CheckCircle />, color: '#43e97b' },
    { label: 'Total Earnings', value: '₹450', icon: <AttachMoney />, color: '#4facfe' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        My Deliveries
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: stat.color + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Active Orders */}
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Active Orders
      </Typography>

      <Grid container spacing={3}>
        {MOCK_DELIVERY_ORDERS.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">
                    Order #{order.id}
                  </Typography>
                  <Chip
                    label={order.status.replace('_', ' ')}
                    color={order.status === 'out_for_delivery' ? 'info' : 'warning'}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Customer
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {order.customerName}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {order.customerPhone}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pickup
                  </Typography>
                  <Typography variant="body2">{order.pickupAddress}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Delivery Address
                  </Typography>
                  <Typography variant="body2">{order.deliveryAddress}</Typography>
                </Box>

                <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Items
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {order.items} items
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Order Value
                    </Typography>
                    <Typography variant="body1" fontWeight="700" color="primary">
                      ₹{order.totalAmount}
                    </Typography>
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Navigation />}
                    onClick={() => window.open(`https://maps.google.com/?q=${order.deliveryAddress}`, '_blank')}
                  >
                    Navigate
                  </Button>
                  {order.status === 'ready_for_pickup' ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/delivery/pickup/${order.id}`)}
                    >
                      Pick Up
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/delivery/confirm/${order.id}`)}
                    >
                      Deliver
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {MOCK_DELIVERY_ORDERS.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <LocalShipping sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No active deliveries
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AssignedOrders;
