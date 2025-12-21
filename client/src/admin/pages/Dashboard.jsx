import { useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  People,
} from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const stats = useMemo(() => ({
    totalOrders: 347,
    totalRevenue: 52340,
    totalCustomers: 1284,
    pendingOrders: 12,
  }), []);

  const revenueData = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
      backgroundColor: 'rgba(255, 107, 53, 0.6)',
    }],
  }), []);

  const orderStatusData = useMemo(() => ({
    labels: ['Pending', 'Preparing', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [12, 25, 150, 5],
      backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c'],
    }],
  }), []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="stat-card">
      <CardContent>
        <Box className="stat-card-content">
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Icon style={{ fontSize: 40, color }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" className="dashboard-container">
      <Typography variant="h4" gutterBottom className="page-title">
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="#ff6b35" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} icon={AttachMoney} color="#2ecc71" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Customers" value={stats.totalCustomers} icon={People} color="#004e89" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending" value={stats.pendingOrders} icon={TrendingUp} color="#f39c12" />
        </Grid>
      </Grid>

      <Grid container spacing={3} className="charts-grid">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Revenue
              </Typography>
              <Bar data={revenueData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              <Pie data={orderStatusData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
