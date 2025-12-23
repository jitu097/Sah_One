import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { MOCK_ORDERS } from '../../shared/utils/mockData';
import { format } from 'date-fns';

const AdminOrders = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((order) => order.status === filterStatus);

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Orders Management
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="preparing">Preparing</MenuItem>
            <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Items</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Payment</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(order.orderDate), 'hh:mm a')}
                  </Typography>
                </TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>
                  <Typography fontWeight="600" color="primary">
                    ₹{order.totalAmount}
                  </Typography>
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status.replace('_', ' ')}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<Visibility />}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredOrders.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default AdminOrders;
