import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
//import SideBar from '../components/SideBar';
import '../styles/pages.css';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
          <h2 className="section-title">Popular Dishes</h2>
          <div className="menu-grid">
            <div className="menu-card">
              <img src="https://via.placeholder.com/200" alt="Chicken" />
              <p className="price">$20.00/kg</p>
              <h3>Chicken</h3>
            </div>
            <div className="menu-card">
              <img src="https://via.placeholder.com/200" alt="Biryani" />
              <p className="price">From $5</p>
              <h3>Biryani</h3>
            </div>
            <div className="menu-card">
              <img src="https://via.placeholder.com/200" alt="Masala Dosa" />
              <p className="price">From $5</p>
              <h3>Masala Dosa</h3>
            </div>
            <div className="menu-card">
              <img src="https://via.placeholder.com/200" alt="Paneer Tikka" />
              <p className="price">From $15</p>
              <h3>Paneer Tikka</h3>
            </div>
            <div className="menu-card">
              <img src="https://via.placeholder.com/200" alt="Rogan Josh" />
              <p className="price">$16.00/kg</p>
              <h3>Rogan Josh</h3>
            </div>
            <div className="menu-card">
              <img src="https://via.placeholder.com/200" alt="Butter Chicken" />
              <p className="price">$25.00/kg</p>
              <h3>Butter Chicken</h3>
            </div>
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
