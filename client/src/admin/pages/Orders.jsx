import { useMemo, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Box,
} from '@mui/material';
import { formatCurrency, formatDateTime, getOrderStatusColor } from '../../shared/utils/helpers';
import toast from 'react-hot-toast';

const mockOrders = [
  {
    _id: 'ORD1701234567890',
    user: { name: 'John Doe' },
    items: [{ menuItem: { name: 'Pizza' }, quantity: 2 }],
    totalAmount: 598,
    createdAt: new Date().toISOString(),
    status: 'pending',
  },
  {
    _id: 'ORD1701234567891',
    user: { name: 'Jane Smith' },
    items: [{ menuItem: { name: 'Burger' }, quantity: 1 }],
    totalAmount: 239,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'preparing',
  },
  {
    _id: 'ORD1701234567892',
    user: { name: 'Bob Johnson' },
    items: [{ menuItem: { name: 'Biryani' }, quantity: 3 }],
    totalAmount: 787,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'delivered',
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success('Order status updated');
  };

  const filteredOrders = useMemo(() => {
    return filterStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === filterStatus);
  }, [orders, filterStatus]);

  return (
    <Container maxWidth="lg" className="orders-management-container">
      <Box className="orders-header">
        <Typography variant="h4" className="page-title">
          Manage Orders
        </Typography>
        <FormControl className="status-filter">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="preparing">Preparing</MenuItem>
            <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>#{order._id.slice(-6)}</TableCell>
                    <TableCell>{order.user?.name || 'N/A'}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.replace('_', ' ')}
                        color={getOrderStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="order-status-select"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="confirmed">Confirmed</MenuItem>
                          <MenuItem value="preparing">Preparing</MenuItem>
                          <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredOrders.length === 0 && (
            <Box className="no-orders-message">
              <Typography color="text.secondary">No orders found</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Orders;
