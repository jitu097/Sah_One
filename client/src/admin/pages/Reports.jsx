import { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = () => {
  const [period, setPeriod] = useState('week');

  const reportData = useMemo(() => ({
    totalRevenue: 52340,
    totalOrders: 347,
    avgOrderValue: 151,
    topItems: [
      { name: 'Margherita Pizza', count: 45 },
      { name: 'Chicken Burger', count: 38 },
      { name: 'Veg Noodles', count: 32 },
    ],
  }), []);

  const revenueChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000],
        borderColor: '#ff6b35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
      },
    ],
  };

  return (
    <Container maxWidth="lg" className="reports-container">
      <Box className="reports-header">
        <Typography variant="h4">Reports & Analytics</Typography>
        <FormControl className="period-selector">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">₹{reportData.totalRevenue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">{reportData.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg Order Value
              </Typography>
              <Typography variant="h4">₹{reportData.avgOrderValue}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="revenue-chart-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Revenue Trend
          </Typography>
          <Line data={revenueChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Selling Items
          </Typography>
          <Box>
            {reportData.topItems?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px solid #eee',
                }}
              >
                <Typography>{item.name}</Typography>
                <Typography color="primary">{item.orders} orders</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Reports;
