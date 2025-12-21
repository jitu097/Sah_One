const Order = require('../models/Order');
const notificationService = require('./notification.service');

// Update order status
exports.updateOrderStatus = async (orderId, newStatus) => {
  try {
    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Update status
    order.status = newStatus;
    
    // Set estimated delivery time for certain statuses
    if (newStatus === 'confirmed') {
      const estimatedTime = new Date();
      estimatedTime.setMinutes(estimatedTime.getMinutes() + 30);
      order.estimatedDeliveryTime = estimatedTime;
    }
    
    // Set actual delivery time when delivered
    if (newStatus === 'delivered') {
      order.actualDeliveryTime = new Date();
    }
    
    await order.save();
    
    // Send notification to user
    await notificationService.notifyOrderStatus(order, newStatus);
    
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Assign delivery person to order
exports.assignDeliveryPerson = async (orderId, deliveryPersonId) => {
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    order.deliveryPerson = deliveryPersonId;
    order.status = 'out_for_delivery';
    
    await order.save();
    
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Calculate estimated delivery time
exports.calculateEstimatedDeliveryTime = (preparationTime) => {
  const currentTime = new Date();
  const estimatedTime = new Date(currentTime.getTime() + preparationTime * 60000);
  return estimatedTime;
};
