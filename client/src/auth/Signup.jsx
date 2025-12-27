import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const images = ['/image.png', '/last.png', '/Homepage.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Successful signup - redirect to user dashboard
    alert('Account created successfully!');
    navigate('/user');
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-brand">
          <img src="/LOGO.png" alt="Sah One Logo" className="brand-logo" />
          <span className="brand-name">Sah One</span>
        </div>

        <div className="signup-content">
          <h1 className="signup-title">Keep your online business organized</h1>
          <p className="signup-subtitle">Sign up to start your 30 days free trial</p>

          <button className="google-signin-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8055 10.2292C19.8055 9.55056 19.7501 8.86726 19.6322 8.19824H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8252C18.7174 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
              <path d="M10.2002 20.0006C12.9517 20.0006 15.2723 19.1151 16.8293 17.5865L13.6066 15.0879C12.7096 15.6979 11.5468 16.0433 10.2043 16.0433C7.54293 16.0433 5.28895 14.2833 4.50607 11.9097H1.18652V14.4818C2.7847 17.6554 6.30933 20.0006 10.2002 20.0006Z" fill="#34A853"/>
              <path d="M4.50191 11.9097C4.08813 10.6677 4.08813 9.33653 4.50191 8.09448V5.52246H1.18652C-0.395508 8.66605 -0.395508 12.3381 1.18652 15.4817L4.50191 11.9097Z" fill="#FBBC04"/>
              <path d="M10.2002 3.95805C11.6246 3.936 13.0035 4.47247 14.0368 5.45722L16.8917 2.60218C15.1847 0.990833 12.9352 0.0969627 10.2002 0.121847C6.30933 0.121847 2.7847 2.46701 1.18652 5.64552L4.50191 8.21753C5.28062 5.83975 7.53877 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label>Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email*</label>
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
              <label>Password*</label>
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

            <button type="submit" className="create-account-btn">
              Create Account
            </button>

            <p className="signup-footer">
              Already have an account? <Link to="/login">Login Here</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="signup-right">
        <div className="image-carousel">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Signup;
