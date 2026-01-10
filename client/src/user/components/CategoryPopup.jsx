import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import '../styles/CategoryPopup.css';

export default function CategoryPopup({ isOpen, onClose }) {
    const navigate = useNavigate();
    const categories = useQuery(api.modules.menu.menu.getAllCategories);

    // Prevent background scrolling when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCategoryClick = (categoryName) => {
        navigate('/user/menu', { state: { category: categoryName } });
        onClose();
    };

    return (
        <div className="category-popup-overlay" onClick={onClose}>
            <div className="category-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <div className="popup-title">
                        <h3>Your Orders and</h3>
                        <span>Collections</span>
                    </div>
                    <div className="item-count-badge">1</div>
                    {/* Note: In a real app the count '1' effectively represents active orders or similar. 
             For now hardcoding or leaving as placeholder based on mockup unless we have order data. 
             If '1' refers to selected category count, it might differ. 
             Mockup shows '1', assuming it's 'Your Orders'. */}
                </div>

                <div className="category-list">
                    {/* Recommended - Static or dynamic if available */}
                    <button className="category-item" onClick={() => handleCategoryClick('All')}>
                        <span className="category-name">Recommended for you</span>
                        <span className="category-count">25</span>
                    </button>

                    {/* Dynamic Categories */}
                    {categories ? (
                        categories.map((cat) => (
                            <button
                                key={cat._id}
                                className="category-item"
                                onClick={() => handleCategoryClick(cat.name)}
                            >
                                <span className="category-name">{cat.name}</span>
                                <span className="category-count">{cat.itemCount || 0}</span>
                            </button>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#888' }}>Loading categories...</div>
                    )}

                    {/* Special Static Item from Mockup */}
                    <div className="category-item special-item">
                        <span className="category-name">LARGE ORDER MENU</span>
                        <span className="arrow-down">▼</span>
                    </div>
                </div>

                <div className="popup-footer">
                    <button className="close-btn" onClick={onClose}>
                        <span>×</span> Close
                    </button>
                </div>
            </div>
        </div>
    );
}
