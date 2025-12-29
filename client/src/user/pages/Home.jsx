import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
//import SideBar from '../components/SideBar';
import '../styles/pages.css';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

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
  
  const slides = [
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <Navbar />
      {/* <SideBar /> */}
      <div className="page-container">
        {/* Hero Carousel Section */}
        <section 
          className="hero-carousel"
          style={{
            background: slides[currentSlide].type === 'original' 
              ? `url('${slides[currentSlide].backgroundImage}') center/cover` 
              : '#ffffff'
          }}
        >
          <button className="carousel-btn prev" onClick={prevSlide}>
            ←
          </button>
          
          <div className="carousel-content">
            {slides[currentSlide].type === 'original' ? (
              <>
                <div className="hero-content">
                  <img src="/34.png" alt="Hero" className="hero-image" />
                  <div className="hero-buttons">
                    <img src="/583.png" alt="See Our Menu" className="btn-image" />
                  </div>
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
              <Link to="/user/breakfast" className="menu-card">
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
                <img src="/Breakfast.jpeg" alt="Breakfast" />
                <p className="price inactive-time">
                  {getTimeStatus(7, 11).timeString}
                </p>
                <h3>Breakfast</h3>
              </div>
            )}
            
            {getTimeStatus(13, 16).isActive ? (
              <Link to="/user/lunch" className="menu-card">
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
            
            {getTimeStatus(19, 23).isActive ? (
              <Link to="/user/dinner" className="menu-card">
                <img src="/Dinner.jpeg" alt="Dinner" />
                <p className="price active-time">
                  {getTimeStatus(19, 23).timeString}
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
                  {getTimeStatus(19, 23).timeString}
                </p>
                <h3>Dinner</h3>
              </div>
            )}
            
          </div>
        </section>

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

        {/* Best Sellers Section */}
        <section className="bestsellers-section">
          <h2 className="section-title">Best Sellers</h2>
          <div className="bestsellers-grid">
            <div className="bestseller-card">
              <img src="https://via.placeholder.com/300x200" alt="Roasted Corn" />
              <h3>Roasted Corn</h3>
              <div className="rating">★★★★★</div>
            </div>
            <div className="bestseller-card">
              <img src="https://via.placeholder.com/300x200" alt="Purple Onion" />
              <h3>Purple Onion</h3>
              <div className="rating">★★★★★</div>
            </div>
            <div className="bestseller-card">
              <img src="https://via.placeholder.com/300x200" alt="Chili Bell Pepper" />
              <h3>Chili Bell Pepper</h3>
              <div className="rating">★★★★★</div>
            </div>
            <div className="bestseller-card">
              <img src="https://via.placeholder.com/300x200" alt="Organic Asparagus" />
              <h3>Organic Asparagus</h3>
              <div className="rating">★★★★★</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
