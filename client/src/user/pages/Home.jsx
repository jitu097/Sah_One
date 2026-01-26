import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import '../styles/pages.css';
import '../styles/Home.css';

import CategoryPopup from '../components/CategoryPopup';

export default function Home() {
  const navigate = useNavigate();
  // Fetch active offers for hero carousel (must be inside component)
  const activeOffers = useQuery(api.modules.offers.offers.getActiveOffers) || [];
  console.log('Active offers:', activeOffers);
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { currentUser } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [partyForm, setPartyForm] = useState({
    name: '',
    phone: '',
    guests: '',
    date: '',
    time: ''
  });

  // Convex queries and mutations
  const createBooking = useMutation(api.modules.bookings.bookings.createBooking);
  const getUserByFirebaseUid = useQuery(
    api.modules.users.users.getUserByFirebaseUid,
    currentUser ? { firebaseUid: currentUser.uid } : "skip"
  );

  const handleAddToCart = (item, portionType = 'full') => {
    const isRestaurantOpen = localStorage.getItem('restaurantOpen');
    if (isRestaurantOpen === 'false') {
      alert('⚠️ Restaurant is temporarily closed. We are not accepting orders at the moment.');
      return;
    }
    
    const price = portionType === 'half' && item.halfPrice ? item.halfPrice : item.fullPrice;
    const uniqueId = `${item._id}_${portionType}`;
    
    addToCart({ 
      ...item, 
      id: uniqueId,
      originalId: item._id,
      portionType: portionType,
      price: price,
      name: portionType === 'half' ? `${item.name} (Half)` : item.name
    });
  };

  const getItemQuantity = (itemId, portionType = 'full') => {
    const uniqueId = `${itemId}_${portionType}`;
    const cartItem = cartItems.find(item => item.id === uniqueId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleUpdateQuantity = (itemId, portionType, change) => {
    const uniqueId = `${itemId}_${portionType}`;
    updateQuantity(uniqueId, change);
  };

  const menuItems = useQuery(api.modules.menu.menu.getAvailableMenuItems);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const filteredItems = menuItems?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeStatus = (startHour, endHour) => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Check if current time is within the range
    if (hours >= startHour && hours < endHour) {
      // Calculate remaining time
      const endTime = new Date(now);
      endTime.setHours(endHour, 0, 0, 0);
      const diff = endTime - now;

      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        isActive: true,
        timeString: `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s left`
      };
    } else {
      return {
        isActive: false,
        timeString: `${startHour > 12 ? startHour - 12 : startHour}${startHour >= 12 ? 'pm' : 'am'} to ${endHour > 12 ? endHour - 12 : endHour}${endHour >= 12 ? 'pm' : 'am'}`
      };
    }
  };

  // Build slides: if there are active offers, show them; else show default slides
  const offerSlides = activeOffers.length > 0
    ? activeOffers.map((offer, idx) => ({
        id: `offer-${offer._id}`,
        type: 'offer',
        offer,
      }))
    : [];

  const defaultSlides = [
    {
      id: 1,
      type: 'original',
      backgroundImage: '/image.png'
    },
    {
      id: 2,
      type: 'image',
      image: '/Section.png'
    },
    {
      id: 3,
      type: 'image',
      image: '/last.png'
    }
  ];

  const slides = offerSlides.length > 0 ? offerSlides : defaultSlides;
  // Debug: print slides array and currentSlide
  console.log('Slides array:', slides);
  console.log('Slides length:', slides.length, 'Current slide:', currentSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const handlePartyFormChange = (e) => {
    setPartyForm({
      ...partyForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePartyFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login to book a table!');
      return;
    }

    if (!getUserByFirebaseUid) {
      alert('Please wait, loading user data...');
      return;
    }

    try {
      await createBooking({
        userId: getUserByFirebaseUid._id,
        name: partyForm.name,
        phone: partyForm.phone,
        guests: parseInt(partyForm.guests),
        date: partyForm.date,
        time: partyForm.time,
      });

      alert('Table booking submitted successfully! We will notify you once it is confirmed.');
      setShowPartyModal(false);
      setPartyForm({ name: '', phone: '', guests: '', date: '', time: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Show these sections only when NOT searching */}
        {!searchQuery && (
          <>
            {/* Hero Carousel Section */}
            <section
              className={`hero-carousel ${slides[currentSlide].type === 'original' ? 'hero-carousel-dynamic' : 'hero-carousel-white'}`}
              style={slides[currentSlide].type === 'original' ? {
                backgroundImage: `url('${slides[currentSlide].backgroundImage}')`
              } : {}}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <button className="carousel-btn prev" onClick={prevSlide}>
                ←
              </button>

              <div className="carousel-content">
                {slides[currentSlide].type === 'offer' ? (
                  <button
                    className="hero-offer-slide"
                    style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, width: '100%' }}
                    onClick={() => {
                      const offer = slides[currentSlide].offer;
                      if (offer.category) {
                        navigate('/user/menu', { state: { category: offer.category } });
                      } else if (offer.items && offer.items.length > 0) {
                        navigate('/user/menu', { state: { item: offer.items[0] } });
                      } else {
                        navigate('/user/menu');
                      }
                    }}
                  >
                    {/* Debug info for inspection */}
                    <div style={{fontSize: '14px', color: '#1976d2', background: '#e3f2fd', padding: '2px 8px', marginBottom: '4px', borderRadius: '4px', width: 'fit-content'}}>
                      Slide index: {currentSlide} / Offer ID: {slides[currentSlide].offer?._id}
                    </div>
                    <div className="offer-card-hero">
                      <div className="offer-discount">
                        {slides[currentSlide].offer.discountValue}
                        {slides[currentSlide].offer.discountType === 'percentage' ? '% OFF' : ' OFF'}
                      </div>
                      <div className="offer-title">{slides[currentSlide].offer.title}</div>
                      <div className="offer-desc">{slides[currentSlide].offer.description}</div>
                      <div className="offer-code">{slides[currentSlide].offer.code}</div>
                      <div className="offer-valid">
                        {new Date(slides[currentSlide].offer.validFrom).toLocaleDateString()} - {new Date(slides[currentSlide].offer.validTo).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ) : slides[currentSlide].type === 'original' ? (
                  // Add a highlight-offer class for flash effect
                  <>
                    <div className="hero-content">
                      <img src="/34.png" alt="Hero" className="hero-image" />
                    </div>
                  </>
                ) : (
                  <div className={`full-image-slide ${currentSlide === 2 ? 'slide-third' : ''}`}>
                    <img src={slides[currentSlide].image} alt={`Slide ${slides[currentSlide].id}`} />
                  </div>
                )}
              </div>

              <button className="carousel-btn next" onClick={nextSlide}>
                →
              </button>

              <div className="carousel-indicators">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </section>

            {/* Menu Items Section */}
            <section className="menu-section">
              <h2 className="section-title">Special Serving Hours</h2>
              <div className="menu-grid">
     
                {getTimeStatus(9, 11).isActive ? (
                  <Link to="/user/serving-hours?slot=breakfast" className="menu-card">
                    <img src="/Breakfast.jpeg" alt="Breakfast" />
                    <p className="price active-time">
                      {getTimeStatus(9, 11).timeString}
                    </p>
                    <h3>Breakfast</h3>
                  </Link>
                ) : (
                  <div className="menu-card locked">
                    <div className="lock-overlay">
                      <span className="lock-icon">🔒</span>
                    </div>
                    <img src="/Breeakfast.png" alt="Breakfast" />
                    <p className="price inactive-time">
                      {getTimeStatus(7, 11).timeString}
                    </p>
                    <h3>Breakfast</h3>
                  </div>
                )}

                {getTimeStatus(13, 16).isActive ? (
                  <Link to="/user/serving-hours?slot=lunch" className="menu-card">
                    <img src="/lunch.jpeg" alt="Lunch" />
                    <p className="price active-time">
                      {getTimeStatus(13, 16).timeString}
                    </p>
                    <h3>Lunch</h3>
                  </Link>
                ) : (
                  <div className="menu-card locked">
                    <div className="lock-overlay">
                      <span className="lock-icon">🔒</span>
                    </div>
                    <img src="/lunch.jpeg" alt="Lunch" />
                    <p className="price inactive-time">
                      {getTimeStatus(13, 16).timeString}
                    </p>
                    <h3>Lunch</h3>
                  </div>
                )}

                {getTimeStatus(19, 24).isActive ? (
                  <Link to="/user/serving-hours?slot=dinner" className="menu-card">
                    <img src="/Dinner.jpeg" alt="Dinner" />
                    <p className="price active-time">
                      {getTimeStatus(19, 24).timeString}
                    </p>
                    <h3>Dinner</h3>
                  </Link>
                ) : (
                  <div className="menu-card locked">
                    <div className="lock-overlay">
                      <span className="lock-icon">🔒</span>
                    </div>
                    <img src="/Dinner.jpeg" alt="Dinner" />
                    <p className="price inactive-time">
                      {getTimeStatus(19, 24).timeString}
                    </p>
                    <h3>Dinner</h3>
                  </div>
                )}

              </div>
            </section>

            {/* Parties Section */}
            <section className="parties-section">
              <div className="parties-image-container">
                <img src="/parties.png" alt="Parties" className="parties-image" />
                <img src="/Background.png" alt="Background" className="parties-background-image" />
                <img
                  src="/69.png"
                  alt="Book Now"
                  className="parties-button-image"
                  onClick={() => setShowPartyModal(true)}
                />
              </div>
            </section>

            {/* Party Booking Modal */}
            {showPartyModal && (
              <div className="modal-overlay" onClick={() => setShowPartyModal(false)}>
                <div className="party-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setShowPartyModal(false)}>
                    ×
                  </button>
                  <h2>Party Booking Enquiry</h2>
                  <form onSubmit={handlePartyFormSubmit} className="party-form">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={partyForm.name}
                        onChange={handlePartyFormChange}
                        required
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={partyForm.phone}
                        onChange={handlePartyFormChange}
                        required
                        placeholder="Enter phone number"
                        pattern="[0-9]{10}"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="guests">Number of Guests *</label>
                      <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={partyForm.guests}
                        onChange={handlePartyFormChange}
                        required
                        placeholder="Enter number of guests"
                        min="1"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="date">Date for Booking *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={partyForm.date}
                        onChange={handlePartyFormChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={partyForm.time}
                        onChange={handlePartyFormChange}
                        required
                      />
                    </div>

                    <button type="submit" className="submit-btn">
                      Submit Enquiry
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Delivery Process Section */}
            <section className="delivery-section">
              <h3 className="delivery-tag">EXPRESS DELIVERY</h3>
              <h2 className="section-title">60 Minutes Delivery Process</h2>
              <p className="section-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce metus orci tempus.</p>

              <div className="delivery-steps">
                <div className="step">
                  <div className="step-icon">🍜</div>
                  <p>Choose your products</p>
                </div>
                <div className="step">
                  <div className="step-icon">🛒</div>
                  <p>Order and make a payment</p>
                </div>
                <div className="step">
                  <div className="step-icon">📍</div>
                  <p>Share your location</p>
                </div>
                <div className="step">
                  <div className="step-icon">🚚</div>
                  <p>Get delivered</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Search Results (Conditional) */}
        {searchQuery ? (
          <section className="bestsellers-section">
            <h2 className="section-title">Search Results</h2>
            <div className="bestsellers-grid">
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div id={`menuitem-${item._id}`} key={item._id}>
                    <MenuItemCard 
                      item={item}
                      onAddToCart={handleAddToCart}
                      quantity={getItemQuantity(item._id)}
                      onUpdateQuantity={(id, change) => handleUpdateQuantity(item._id, 'full', change)}
                    />
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No items found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          /* Best Sellers Section */
          <section className="bestsellers-section">
            <h2 className="section-title">Best Sellers</h2>
            <div className="bestsellers-grid">
              {menuItems ? (
                menuItems.slice(0, 4).map((item) => (
                  <MenuItemCard 
                    key={item._id} 
                    item={item}
                    onAddToCart={handleAddToCart}
                    quantity={getItemQuantity(item._id)}
                    onUpdateQuantity={(id, change) => handleUpdateQuantity(item._id, 'full', change)}
                  />
                ))
              ) : (
                <div className="loading-text">Loading delicious items...</div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Floating Menu Button */}
      <CategoryPopup
        isOpen={showCategoryPopup}
        onClose={() => setShowCategoryPopup(false)}
        onOpenPartyModal={() => setShowPartyModal(true)}
      />

      {/* Floating Menu Button */}
      <button className="floating-menu-btn" onClick={() => setShowCategoryPopup(true)}>
        <span>Menu</span>
        <span className="arrow">↑</span>
      </button>
    </>
  );
}
