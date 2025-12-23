import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from '../shared/components/Navbar';
import BottomNav from '../shared/components/BottomNav';

function App() {
  const location = useLocation();

  // Pages where we don't show navigation (landing page, login, signup)
  const publicPages = ['/', '/login', '/signup'];
  const isPublicPage = publicPages.includes(location.pathname);

  // Show navbar on all pages except public pages
  const showNavbar = !isPublicPage;
  
  // Show bottom navigation only on mobile for non-public pages
  const showBottomNav = !isPublicPage && window.innerWidth <= 768;

  return (
    <Box className="app-container">
      {/* Navigation bar for logged-in users */}
      {showNavbar && <Navbar />}
      
      {/* Main content area where all pages render */}
      <Box component="main" className="main-content">
        <AppRoutes />
      </Box>
      
      {/* Bottom navigation for mobile users */}
      {showBottomNav && <BottomNav />}
    </Box>
  );
}

export default App;
