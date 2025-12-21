export const roleGuard = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

export const getRoleBasedRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'delivery':
      return '/delivery';
    case 'user':
    default:
      return '/';
  }
};

export const hasPermission = (userRole, permission) => {
  const rolePermissions = {
    admin: ['manage_menu', 'manage_orders', 'view_reports', 'manage_offers', 'manage_users'],
    delivery: ['view_orders', 'update_delivery_status'],
    user: ['place_order', 'view_orders', 'manage_profile'],
  };

  return rolePermissions[userRole]?.includes(permission) || false;
};
