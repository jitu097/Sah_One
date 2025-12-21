import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import AppRoutes from './routes';
import Navbar from '../shared/components/Navbar';
import BottomNav from '../shared/components/BottomNav';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isLoginPage = location.pathname === '/login';
  const showBottomNav = isAuthenticated && !isLoginPage && window.innerWidth <= 768;

  return (
    <Box className="app-container">
      {isAuthenticated && !isLoginPage && <Navbar />}
      <Box component="main" className="main-content">
        <AppRoutes />
      </Box>
      {showBottomNav && <BottomNav />}
    </Box>
  );
}

export default App;
