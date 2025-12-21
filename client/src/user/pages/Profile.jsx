import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import { Person, Edit } from '@mui/icons-material';
import { logout, updateProfile } from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <Container maxWidth="sm" className="profile-container">
      <Card className="profile-card">
        <CardContent>
          <Box className="profile-header">
            <Avatar className="profile-avatar">
              <Person className="profile-avatar-icon" />
            </Avatar>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary" className="user-role">
              {user?.role?.toUpperCase()}
            </Typography>
          </Box>

          <Divider className="profile-divider" />

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />
              <Box className="profile-actions">
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                >
                  Save Changes
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          ) : (
            <>
              <Box className="profile-info-item">
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Box>
              <Box className="profile-info-item">
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{user?.phone || 'Not provided'}</Typography>
              </Box>
              <Box className="profile-info-item">
                <Typography variant="body2" color="text.secondary">Member Since</Typography>
                <Typography variant="body1">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                className="edit-profile-button"
              >
                Edit Profile
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
