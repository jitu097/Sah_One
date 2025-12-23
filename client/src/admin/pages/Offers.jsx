import { Container, Typography, Paper, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { Add, LocalOffer } from '@mui/icons-material';

const AdminOffers = () => {
  const offers = [
    {
      id: 1,
      title: 'Weekend Special',
      description: '20% off on all orders above ₹500',
      code: 'WEEKEND20',
      validUntil: '2024-02-28',
      isActive: true,
    },
    {
      id: 2,
      title: 'First Order',
      description: 'Get ₹100 off on your first order',
      code: 'FIRST100',
      validUntil: '2024-03-31',
      isActive: true,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Offers & Promotions
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Create Offer
        </Button>
      </Box>

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} md={6} key={offer.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: '#667eea20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#667eea',
                    }}
                  >
                    <LocalOffer />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="600">
                      {offer.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valid until: {offer.validUntil}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" gutterBottom>
                  {offer.description}
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: '#f5f5f5',
                    border: '2px dashed #ddd',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Coupon Code
                  </Typography>
                  <Typography variant="h6" fontWeight="700" color="primary">
                    {offer.code}
                  </Typography>
                </Paper>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button fullWidth variant="outlined">
                    Edit
                  </Button>
                  <Button fullWidth variant="outlined" color="error">
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminOffers;
