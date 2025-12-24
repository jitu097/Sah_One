import { Container, Grid, Card, CardContent, Typography, Box, Paper } from '@mui/material';
import {
  ShoppingBag,
  AttachMoney,
  People,
  LocalShipping,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MOCK_STATS, MOCK_CHARTS_DATA, MOCK_ORDERS } from '../utils/mockData';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Orders',
      value: MOCK_STATS.totalOrders,
      icon: <ShoppingBag />,
      color: '#667eea',
      change: '+12%',
      positive: true,
    },
    {
      title: 'Revenue',
      value: `₹${MOCK_STATS.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney />,
      color: '#4facfe',
      change: '+23%',
      positive: true,
    },
    {
      title: 'Total Users',
      value: MOCK_STATS.totalUsers,
      icon: <People />,
      color: '#f093fb',
      change: '+8%',
      positive: true,
    },
    {
      title: 'Active Delivery',
      value: MOCK_STATS.activeDelivery,
      icon: <LocalShipping />,
      color: '#43e97b',
      change: '-2',
      positive: false,
    },
  ];

  const ordersChartData = {
    labels: MOCK_CHARTS_DATA.ordersOverTime.labels,
    datasets: [
      {
        label: 'Orders',
        data: MOCK_CHARTS_DATA.ordersOverTime.data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: MOCK_CHARTS_DATA.categoryDistribution.labels,
    datasets: [
      {
        data: MOCK_CHARTS_DATA.categoryDistribution.data,
        backgroundColor: [
          '#667eea',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fa709a',
          '#feca57',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {stat.positive ? (
                      <TrendingUp sx={{ color: '#4caf50', fontSize: 18 }} />
                    ) : (
                      <TrendingDown sx={{ color: '#f44336', fontSize: 18 }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ color: stat.positive ? '#4caf50' : '#f44336' }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Orders Overview
            </Typography>
            <Box sx={{ height: 280 }}>
              <Line data={ordersChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Category Distribution
            </Typography>
            <Box sx={{ height: 280 }}>
              <Doughnut data={categoryChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
          Recent Orders
        </Typography>
        {MOCK_ORDERS.slice(0, 5).map((order) => (
          <Box
            key={order.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '&:last-child': { borderBottom: 0 },
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="600">
                Order #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(order.orderDate), 'MMM dd, yyyy • hh:mm a')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" fontWeight="600" color="primary">
                ₹{order.totalAmount}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor:
                    order.status === 'delivered'
                      ? '#4caf5020'
                      : order.status === 'preparing'
                        ? '#ff980020'
                        : '#2196f320',
                  color:
                    order.status === 'delivered'
                      ? '#4caf50'
                      : order.status === 'preparing'
                        ? '#ff9800'
                        : '#2196f3',
                }}
              >
                {order.status.replace('_', ' ')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default Dashboard;
