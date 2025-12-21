const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getDashboardStats,
  getAllUsers
} = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Menu management
router.get('/menu', getMenuItems);
router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);

module.exports = router;
