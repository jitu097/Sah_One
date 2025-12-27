import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Check credentials and determine role
    if (formData.email === 'admin@test.com' && formData.password === 'admin') {
      navigate('/admin');
    } else if (formData.email === 'delivery@test.com' && formData.password === 'delivery') {
      navigate('/delivery');
    } else if (formData.email === 'user@test.com' && formData.password === 'user') {
      navigate('/user');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-image-wrapper">
          <img src="/login.jpeg" alt="Food" className="login-image" />
          <div className="login-overlay">
            <h2 className="login-tagline">Need some<br />Pizza, yo?</h2>
            <p className="login-description">C'mon and order from nearby Pizza<br />delivery and pickup restaurants</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <img src="/LOGO.png" alt="Sah One Logo" className="login-logo" />
            <h1 className="login-brand">Sah One</h1>
            <p className="login-welcome">Welcome Back!</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="login-footer">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>

            <div className="test-credentials">
              <p><strong>Test Credentials:</strong></p>
              <p>Admin: admin@test.com / admin</p>
              <p>Delivery: delivery@test.com / delivery</p>
              <p>User: user@test.com / user</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
