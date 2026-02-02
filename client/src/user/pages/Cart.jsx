import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import CategoryPopup from '../components/CategoryPopup';
import PaymentModal from '../components/PaymentModal';
import '../styles/pages.css';
import '../styles/cart.css';
import { isRestaurantOpen } from '../../utils/restaurantStatus';

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getCartTotal,
    getCartDiscount,
    getCartCoupon,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();

  const { currentUser } = useAuth();
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  const user = useQuery(api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  const createOrder = useMutation(api.modules.orders.orders.createOrder);
  const navigate = useNavigate();
  const deliveryCharge = 50;

  // Fetch global serving hours config
  const specialHours = useQuery(api.modules.servingHours.servingHours.getGlobalServingHours);

  // Check if restaurant is open using util
  // const isRestaurantOpen = ... (removed local function)

  const handleUpdateQuantity = (cartItemId, change) => {
    if (!isRestaurantOpen(specialHours) && change > 0) {
      alert('⚠️ Restaurant is temporarily closed. Cannot increase item quantity.');
      return;
    }
    // Note: Use cartItemId directly
    updateQuantity(cartItemId, change);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponMessage({ type: 'loading', text: 'Applying...' });

    const result = await applyCoupon(couponInput.trim().toUpperCase());
    if (result.success) {
      setCouponMessage({ type: 'success', text: 'Coupon applied successfully!' });
      setCouponInput('');
    } else {
      setCouponMessage({ type: 'error', text: result.error || 'Invalid coupon' });
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponMessage({ type: '', text: '' });
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const cartTotal = getCartTotal(); // This is Subtotal - Discount
  const finalTotal = cartTotal + deliveryCharge;
  const appliedCoupon = getCartCoupon();

  // If coupon became invalid (e.g. cart change), backend might return "isInvalid" or just null.
  // My backend returns { error: "...", isInvalid: true} if code exists but invalid.
  // Let's handle that display.
  if (appliedCoupon?.isInvalid && couponMessage.type !== 'error') {
    // Optional: set a message once. But render cycle might loop. 
    // Just display it on the UI.
  }

  const handleCheckout = () => {
    if (!currentUser) {
      alert("Please login to checkout");
      navigate('/login');
      return;
    }

    // Check DB address first, then local storage
    const savedAddress = (user && user.address) ? user.address : localStorage.getItem('userAddress');

    if (!savedAddress) {
      alert("Please add your delivery address by clicking the location button in the navbar.");
      return;
    }

    const addressData = JSON.parse(savedAddress);
    if (!addressData.mobileNumber || !addressData.city || !addressData.deliveryArea) {
      alert("Please complete your delivery address with all required fields.");
      return;
    }

    // Open payment modal
    // Note: PaymentModal expects totalAmount 
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Use DB address if available
      const savedAddress = (user && user.address) ? user.address : localStorage.getItem('userAddress');
      const addressData = savedAddress ? JSON.parse(savedAddress) : {};
      const deliveryAddress = `${addressData.deliveryArea || ''}, ${addressData.company || ''}, Floor: ${addressData.floor || ''}, ${addressData.locality || ''}, ${addressData.city || ''}, Mobile: ${addressData.mobileNumber || ''}`;

      const orderItems = cartItems.map(item => ({
        itemId: item.itemId, // Menu Item ID
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        portion: item.selectedPortion || 'Full',
        image: item.image || ''
      }));

      await createOrder({
        userId: user._id,
        items: orderItems,
        totalAmount: finalTotal,
        deliveryAddress: deliveryAddress,
        customerName: user.name || '',
        customerPhone: addressData.mobileNumber || user.phone || '',
        customerEmail: user.email || '',
        paymentMethod: 'Online',
        deliveryCharge: deliveryCharge,
        subtotal: subtotal
      });

      // Clear cart
      await clearCart();

      alert('✅ Order placed successfully!');

      // Navigate to order page
      navigate('/user/orders');
    } catch (error) {
      // ... existing error handling
      console.error(error);
      alert('❌ Failed to place order');
      return;
    }
  };

  return (
    <>
      <div className="cart-backdrop" onClick={() => navigate(-1)}></div>
      <div className="cart-sidebar">
        <div className="cart-sidebar-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>My Cart</h1>

        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add some delicious items from our menu!</p>
              <button
                className="browse-menu-btn"
                onClick={() => setShowCategoryPopup(true)}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={item.image || '/image.png'}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => e.target.src = '/image.png'}
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-portion">
                    {item.selectedPortion === 'half' ? 'Half Portion' : 'Full Portion'}
                  </p>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">
                      ₹{item.price}
                    </span>
                    <div className="cart-item-controls">
                      <button
                        className="cart-qty-btn minus"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button
                        className="cart-qty-btn plus"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="cart-item-delete"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            {/* Coupon Section */}
            <div className="coupon-section">
              {appliedCoupon && !appliedCoupon.isInvalid ? (
                <div className="applied-coupon-container">
                  <div className="applied-coupon">
                    <span className="coupon-code">🏷️ {appliedCoupon.code}</span>
                    <span className="coupon-discount">-₹{appliedCoupon.discountAmount}</span>
                    <button onClick={handleRemoveCoupon} className="remove-coupon-btn">✕</button>
                  </div>
                  {(appliedCoupon.description || appliedCoupon.title) && (
                    <div className="coupon-description">
                      {appliedCoupon.description || appliedCoupon.title}
                    </div>
                  )}
                </div>
              ) : (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button onClick={handleApplyCoupon}>Apply</button>
                </div>
              )}
              {couponMessage.text && (
                <p className={`coupon-msg ${couponMessage.type}`}>{couponMessage.text}</p>
              )}
              {appliedCoupon?.isInvalid && (
                <p className="coupon-msg error">{appliedCoupon.error}</p>
              )}
            </div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery:</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>

      <CategoryPopup
        isOpen={showCategoryPopup}
        onClose={() => setShowCategoryPopup(false)}
        onOpenPartyModal={() => navigate('/user')}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={finalTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
