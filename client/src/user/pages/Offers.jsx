import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import '../styles/Offers.css';

export default function Offers() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  // Fetch active offers from Convex
  const offers = useQuery(api.modules.offers.offers.getActiveOffers) || [];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOfferClick = (offer) => {
    // Copy the code
    handleCopyCode(offer.code);

    // Build categories array (supports both old and new schema)
    const categories = [...(offer.categories || [])];
    if (offer.category) categories.push(offer.category);
    const items = offer.items || [];

    // Navigate to menu with coupon filter (same as carousel)
    navigate('/user/menu', {
      state: {
        filterMode: 'coupon',
        couponCode: offer.code,
        allowedCategories: categories,
        allowedItems: items
      }
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDiscountText = (offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else if (offer.discountType === 'fixed') {
      return `₹${offer.discountValue} OFF`;
    } else if (offer.buyQuantity && offer.getQuantity) {
      return `Buy ${offer.buyQuantity} Get ${offer.getQuantity}`;
    }
    return 'Special Offer';
  };

  if (!offers) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading offers...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>🎁 Special Offers</h1>
            <p className="page-header-subtitle">
              Save more with our exclusive deals and discounts
            </p>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>No Active Offers</h3>
            <p>Check back soon for exciting deals!</p>
          </div>
        ) : (
          <>
            <div className="offers-grid">
              {offers.map((offer) => (
                <div 
                  key={offer._id} 
                  className="offer-card"
                  onClick={() => handleOfferClick(offer)}
                  style={{ cursor: 'pointer' }}
                >
                  {offer.imageUrl && (
                    <div className="offer-image">
                      <img src={offer.imageUrl} alt={offer.title} loading="lazy" decoding="async" srcSet={offer.imageUrl ? `${offer.imageUrl}?w=300 300w, ${offer.imageUrl}?w=600 600w` : undefined} sizes="(max-width: 600px) 300px, 600px" />
                      <div className="offer-badge">{getDiscountText(offer)}</div>
                    </div>
                  )}
                  <div className="offer-content">
                    <h3>{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>
                    
                    {offer.minOrderAmount && (
                      <p className="offer-min-order">
                        Min. Order: ₹{offer.minOrderAmount}
                      </p>
                    )}
                    
                    {offer.maxDiscount && (
                      <p className="offer-max-discount">
                        Max. Discount: ₹{offer.maxDiscount}
                      </p>
                    )}

                    <div className="offer-code-section">
                      <div className="offer-code">
                        <span className="code-label">Code:</span>
                        <span className="code-value">{offer.code}</span>
                      </div>
                      <button 
                        className={`copy-code-btn ${copiedCode === offer.code ? 'copied' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(offer.code);
                        }}
                      >
                        {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    
                    <p className="offer-validity">
                      Valid till {formatDate(offer.validTo)}
                    </p>

                    {offer.categories && offer.categories.length > 0 && (
                      <div className="offer-categories">
                        <span className="categories-label">Valid on:</span>
                        {offer.categories.map((cat, idx) => (
                          <span key={idx} className="category-tag">{cat}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="offers-footer">
              <p>💡 <strong>Pro Tip:</strong> Click on any offer to copy the code and start shopping!</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
