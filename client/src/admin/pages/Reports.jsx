import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { TrendingUp, ShoppingCart, AttachMoney, Star } from '@mui/icons-material';

const AdminReports = () => {
  const reports = [
    {
      title: 'Total Sales',
      value: '₹45,670',
      change: '+15% from last month',
      icon: <AttachMoney />,
      color: '#4facfe',
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+12% from last month',
      icon: <ShoppingCart />,
      color: '#667eea',
    },
    {
      title: 'Average Order Value',
      value: '₹293',
      change: '+5% from last month',
      icon: <TrendingUp />,
      color: '#f093fb',
    },
    {
      title: 'Customer Satisfaction',
      value: '4.5/5',
      change: 'Based on 89 reviews',
      icon: <Star />,
      color: '#ffc107',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: report.color + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: report.color,
                  mb: 2,
                }}
              >
                {report.icon}
              </Box>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                {report.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {report.title}
              </Typography>
              <Typography variant="caption" color="success.main">
                {report.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Top Performing Items
        </Typography>
        <Box sx={{ mt: 2 }}>
          {['Margherita Pizza', 'Chicken Burger', 'Paneer Butter Masala', 'Veg Hakka Noodles'].map(
            (item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: index < 3 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body1">{item}</Typography>
                <Typography variant="body1" fontWeight="600" color="primary">
                  {[45, 38, 32, 28][index]} orders
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminReports;
