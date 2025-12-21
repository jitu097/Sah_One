const express = require('express');
const router = express.Router();
const {
  getAssignedOrders,
  updateDeliveryStatus,
  markAsPickedUp,
  markAsDelivered,
  getDeliveryHistory
} = require('../controllers/delivery.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All routes require authentication and delivery role
router.use(protect);
router.use(authorize('delivery'));

router.get('/assigned-orders', getAssignedOrders);
router.put('/orders/:id/status', updateDeliveryStatus);
router.put('/orders/:id/pickup', markAsPickedUp);
router.put('/orders/:id/deliver', markAsDelivered);
router.get('/history', getDeliveryHistory);

module.exports = router;
