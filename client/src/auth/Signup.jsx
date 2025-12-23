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
} from '@mui/material';
import { RestaurantMenu, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from './authSlice';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
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

        // Simple validation
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            toast.error('Please fill all fields');
            return;
        }

        // Mock signup - always creates a user account
        const userData = {
            id: 'user_' + Date.now(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: 'user',
        };

        dispatch(login(userData));
        toast.success('Account created successfully!');
        navigate('/user');
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
                <Card sx={{ width: '100%', boxShadow: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <RestaurantMenu sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
                                Join Sah One
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create your account to order delicious food
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                margin="normal"
                                required
                                autoFocus
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
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
                                placeholder="+1 234 567 8900"
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
                                Create Account
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 500 }}>
                                        Sign In
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

export default Signup;
