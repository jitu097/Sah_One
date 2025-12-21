import { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import toast from 'react-hot-toast';

const mockOffers = [
  {
    _id: '1',
    code: 'WELCOME20',
    description: 'Welcome offer - Get 20% off on your first order',
    discountPercentage: 20,
    minOrderAmount: 199,
    maxDiscount: 100,
    validUntil: '2024-12-31',
    isActive: true,
  },
  {
    _id: '2',
    code: 'SAVE50',
    description: 'Save ₹50 on orders above ₹299',
    discountPercentage: 15,
    minOrderAmount: 299,
    maxDiscount: 50,
    validUntil: '2024-11-30',
    isActive: true,
  },
  {
    _id: '3',
    code: 'FREESHIP',
    description: 'Free shipping on orders above ₹499',
    discountPercentage: 10,
    minOrderAmount: 499,
    maxDiscount: 40,
    validUntil: '2024-10-31',
    isActive: false,
  },
];

const Offers = () => {
  const [offers, setOffers] = useState(mockOffers);
  const [open, setOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercentage: '',
    minOrderAmount: '',
    maxDiscount: '',
    validUntil: '',
    isActive: true,
  });

  const handleOpen = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        ...offer,
        validUntil: offer.validUntil?.split('T')[0] || '',
      });
    } else {
      setEditingOffer(null);
      setFormData({
        code: '',
        description: '',
        discountPercentage: '',
        minOrderAmount: '',
        maxDiscount: '',
        validUntil: '',
        isActive: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingOffer(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOffer) {
      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer._id === editingOffer._id
            ? { ...offer, ...formData }
            : offer
        )
      );
      toast.success('Offer updated');
    } else {
      const newOffer = {
        ...formData,
        _id: Date.now().toString(),
        discountPercentage: Number(formData.discountPercentage),
        minOrderAmount: Number(formData.minOrderAmount),
        maxDiscount: Number(formData.maxDiscount),
      };
      setOffers(prevOffers => [...prevOffers, newOffer]);
      toast.success('Offer created');
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this offer?')) {
      setOffers(prevOffers => prevOffers.filter(offer => offer._id !== id));
      toast.success('Offer deleted');
    }
  };

  return (
    <Container maxWidth="lg" className="offers-management-container">
      <Box className="offers-header">
        <Typography variant="h4">Manage Offers</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Offer
        </Button>
      </Box>

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer._id}>
            <Card>
              <CardContent>
                <Box className="offer-card-header">
                  <Typography variant="h6">{offer.code}</Typography>
                  <Chip
                    label={offer.isActive ? 'Active' : 'Inactive'}
                    color={offer.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {offer.description}
                </Typography>
                <Typography variant="body2" className="offer-details">
                  Discount: {offer.discountPercentage}%
                </Typography>
                <Typography variant="body2">
                  Min Order: ₹{offer.minOrderAmount}
                </Typography>
                <Typography variant="body2">
                  Max Discount: ₹{offer.maxDiscount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valid Until: {new Date(offer.validUntil).toLocaleDateString()}
                </Typography>
                <Box className="offer-actions">
                  <IconButton color="primary" onClick={() => handleOpen(offer)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(offer._id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add Offer'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Offer Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
              required
            />
            <TextField
              fullWidth
              label="Discount Percentage"
              name="discountPercentage"
              type="number"
              value={formData.discountPercentage}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Minimum Order Amount"
              name="minOrderAmount"
              type="number"
              value={formData.minOrderAmount}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Maximum Discount"
              name="maxDiscount"
              type="number"
              value={formData.maxDiscount}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Valid Until"
              name="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingOffer ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Offers;
