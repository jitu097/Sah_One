const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  trackOrder
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

// All routes are protected
router.use(protect);

router.post('/orders', createOrder);
router.get('/orders/my-orders', getMyOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/cancel', cancelOrder);
router.get('/orders/:id/track', trackOrder);

module.exports = router;
