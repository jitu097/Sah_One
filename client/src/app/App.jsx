import React from 'react';
import { Box } from '@mui/material';
import AppRoutes from './routes';

function App() {
  return (
    <Box className="app-container">
      {/* Main content area where all pages render */}
      {/* Navigation is now handled within each role's pages */}
      <Box component="main" className="main-content">
        <AppRoutes />
      </Box>
    </Box>
  );
}

export default App;
