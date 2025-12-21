import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { RestaurantMenu } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 0) {
      // Login with fixed credentials
      if (formData.email === 'admin123@gmail.com' && formData.password === 'admin') {
        navigate('/admin');
      } else if (formData.email === 'delivery123@gmail.com' && formData.password === 'delivery') {
        navigate('/delivery');
      } else {
        // Any other email/password goes to user dashboard
        navigate('/');
      }
    } else {
      // Registration - any input goes to user dashboard
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-container">
        <Card className="login-card">
          <CardContent className="login-card-content">
            <Box className="login-header">
              <RestaurantMenu className="login-icon" />
              <Typography variant="h4" component="h1" className="app-title">
                Sah One
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your favorite food delivery app
              </Typography>
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} centered className="auth-tabs">
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            <form onSubmit={handleSubmit} className="auth-form">
              {activeTab === 1 && (
                <>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </>
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                helperText={activeTab === 0 ? "Admin: admin123@gmail.com | Delivery: delivery123@gmail.com | User: any email" : ""}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                className="submit-button"
              >
                {activeTab === 0 ? 'Login' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
