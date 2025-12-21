import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // UI only - no actual authentication
  return <Outlet />;
};

export default ProtectedRoute;
