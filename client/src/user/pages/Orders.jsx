import { Container, Typography, Grid, Card, CardContent, Box, Chip, Button } from '@mui/material';
import { AccessTime, CheckCircle, LocalShipping, Cancel } from '@mui/icons-material';
import { MOCK_ORDERS } from '../../shared/utils/mockData';
import { format } from 'date-fns';

const Orders = () => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'out_for_delivery':
        return <LocalShipping sx={{ color: '#2196f3' }} />;
      case 'preparing':
        return <AccessTime sx={{ color: '#ff9800' }} />;
      case 'cancelled':
        return <Cancel sx={{ color: '#f44336' }} />;
      default:
        return <AccessTime sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'out_for_delivery':
        return 'info';
      case 'preparing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        My Orders
      </Typography>

      {MOCK_ORDERS.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No orders yet
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {MOCK_ORDERS.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(order.orderDate), 'MMM dd, yyyy • hh:mm a')}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {order.items.map((item, index) => (
                      <Typography key={index} variant="body2" color="text.secondary">
                        {item.quantity}x {item.name}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Payment: {order.paymentMethod}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        To: {order.deliveryAddress}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight="700" color="primary">
                        ₹{order.totalAmount}
                      </Typography>
                      {order.status === 'out_for_delivery' && (
                        <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                          Track Order
                        </Button>
                      )}
                    </Box>
                  </Box>
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
