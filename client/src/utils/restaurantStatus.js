// Helper functions for restaurant status management

/**
 * Check if the restaurant is currently open
 * @param {Object} servingHoursConfig - The global serving hours configuration from DB
 * @returns {boolean} True if restaurant is open, false otherwise
 */
export const isRestaurantOpen = (servingHoursConfig) => {
  // If config is not loaded yet, default to TRUE to avoid blocking (or FALSE if conservative)
  // Logic: !isClosed.
  if (!servingHoursConfig) return true;
  return !servingHoursConfig.isClosed;
};

/**
 * Show alert when restaurant is closed and user tries to add to cart
 */
export const showClosedAlert = () => {
  alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
};

/**
 * Safe add to cart function that checks restaurant status
 * @param {Function} addToCart - The original addToCart function
 * @param {Object} item - The item to add to cart
 * @param {Object} servingHoursConfig - The global serving hours configuration from DB
 * @returns {boolean} True if item was added, false if restaurant is closed
 */
export const safeAddToCart = (addToCart, item, servingHoursConfig) => {
  if (!isRestaurantOpen(servingHoursConfig)) {
    showClosedAlert();
    return false;
  }
  addToCart(item);
  return true;
};

/**
 * Safe update quantity function that checks restaurant status for increments
 * @param {Function} updateQuantity - The original updateQuantity function
 * @param {number} itemId - The item ID
 * @param {number} change - The quantity change (positive or negative)
 * @param {Object} servingHoursConfig - The global serving hours configuration from DB
 * @returns {boolean} True if quantity was updated, false if restaurant is closed
 */
export const safeUpdateQuantity = (updateQuantity, itemId, change, servingHoursConfig) => {
  // Allow decrements even when closed, but not increments
  if (!isRestaurantOpen(servingHoursConfig) && change > 0) {
    showClosedAlert();
    return false;
  }
  updateQuantity(itemId, change);
  return true;
};

/**
 * Get the current restaurant status
 * @param {Object} servingHoursConfig - The global serving hours configuration from DB
 * @returns {Object} { isOpen: boolean, statusText: string }
 */
export const getRestaurantStatus = (servingHoursConfig) => {
  const isOpen = isRestaurantOpen(servingHoursConfig);
  return {
    isOpen,
    statusText: isOpen ? 'OPEN' : 'CLOSED'
  };
};
