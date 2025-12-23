import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { RestaurantMenu, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from './authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let userData;
    let redirectPath;

    // Check credentials and determine role
    if (formData.email === 'admin123@gmail.com' && formData.password === 'admin') {
      userData = {
        id: 'admin1',
        name: 'Admin User',
        email: formData.email,
        role: 'admin',
      };
      redirectPath = '/admin';
      toast.success('Welcome Admin!');
    } else if (formData.email === 'delivery123@gmail.com' && formData.password === 'delivery') {
      userData = {
        id: 'delivery1',
        name: 'Delivery Person',
        email: formData.email,
        role: 'delivery',
      };
      redirectPath = '/delivery';
      toast.success('Welcome Delivery Partner!');
    } else {
      // Any other credentials = user
      userData = {
        id: 'user1',
        name: 'John Doe',
        email: formData.email,
        role: 'user',
      };
      redirectPath = '/user';
      toast.success('Welcome!');
    }

    dispatch(login(userData));
    navigate(redirectPath);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <RestaurantMenu sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your Sah One account
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <strong>Test Credentials:</strong><br />
              Admin: admin123@gmail.com / admin<br />
              Delivery: delivery123@gmail.com / delivery<br />
              User: Any email / Any password
            </Alert>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                autoFocus
                placeholder="Enter any email"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="Enter any password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign In
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 500 }}>
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
