import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/offers.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

// Offer Templates with Theme Colors
const OFFER_TEMPLATES = [
  { id: 1, name: 'Buy 1 Get 1', type: 'bogo', gradient: 'var(--primary-gradient, linear-gradient(135deg, #ff9933 0%, #ff5e3a 100%))' },
  { id: 2, name: '50% Off', type: 'percentage', value: 50, gradient: 'var(--secondary-gradient, linear-gradient(135deg, #4facfe 0%, #00f2fe 100%))' },
  { id: 3, name: 'Flat ₹100 Off', type: 'flat', value: 100, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 4, name: 'Free Delivery', type: 'free_delivery', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
];

export default function Offers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit'
  const [currentEditId, setCurrentEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'expired'
  const formRef = useRef(null);

  // Convex Hooks
  const offersRaw = useQuery(api.modules.offers.offers.getAllOffers) || [];
  const createOffer = useMutation(api.modules.offers.offers.createOffer);
  const updateOffer = useMutation(api.modules.offers.offers.updateOffer);
  const deleteOffer = useMutation(api.modules.offers.offers.deleteOffer);
  const toggleOfferStatus = useMutation(api.modules.offers.offers.toggleOfferStatus);


  // Fetch categories and menu items for offer targeting
  const categoriesRaw = useQuery(api.modules.menu.menu.getAllCategories) || [];
  const menuItemsRaw = useQuery(api.modules.menu.menu.getAllMenuItems) || [];

  const categories = categoriesRaw.map(c => ({
    ...c,
    id: c._id,
    name: c.name
  }));
  const menuItems = menuItemsRaw.map(i => ({
    ...i,
    id: i._id,
    name: i.name,
    category: i.category
  }));

  // Map backend offers to frontend display format
  const offers = offersRaw.map(o => ({
    ...o,
    id: o._id,
    name: o.title,
    type: o.discountType === 'percentage' && o.discountValue === 100 ? 'bogo' : (o.discountType === 'fixed' ? 'flat' : o.discountType),
    value: o.discountValue,
    minOrder: o.minOrderAmount,
    startDate: new Date(o.validFrom).toISOString().split('T')[0],
    endDate: new Date(o.validTo).toISOString().split('T')[0],
    gradient: OFFER_TEMPLATES.find(t => t.type === o.discountType)?.gradient || 'var(--primary-gradient)'
  }));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    isActive: true,
    categories: [],
    items: []
  });

    // Handle image upload (now in correct scope)
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', 'sah-one-menu');
        const res = await fetch('https://api.cloudinary.com/v1_1/drpbuhxmr/image/upload', {
          method: 'POST',
          body: formDataUpload
        });
        const data = await res.json();
        console.log('Cloudinary upload response:', data);
        if (data.secure_url) {
          setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
        } else {
          alert('Image upload failed: ' + (data.error?.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Image upload error:', err);
        alert('Image upload failed');
      }
    };
  const scrollToForm = () => {
    if (formRef.current) {
      setTimeout(() => {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleCreateFromTemplate = (template) => {
    setFormMode('create');
    setCurrentEditId(null);
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setFormData({
      title: template.name,
      description: template.type === 'bogo' ? 'Buy 1 Get 1 Free on selected items' : `${template.value}% off on all orders`,
      code: '',
      discountType: template.type === 'flat' ? 'fixed' : (template.type === 'bogo' ? 'percentage' : 'percentage'),
      discountValue: template.value || (template.type === 'bogo' ? 100 : ''),
      minOrderAmount: '',
      maxDiscount: '',
      validFrom: today,
      validTo: nextMonth,
      isActive: true,
      categories: [],
      items: []
    });
    setIsFormOpen(true);
    scrollToForm();
  };

  const handleCreateCustom = () => {
    setFormMode('create');
    setCurrentEditId(null);
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      validFrom: today,
      validTo: nextMonth,
      isActive: true,
      categories: [],
      items: []
    });
    setIsFormOpen(true);
    scrollToForm();
  };

  const handleEdit = (offer) => {
    setFormMode('edit');
    setCurrentEditId(offer.id);

    setFormData({
      title: offer.title,
      description: offer.description,
      code: offer.code,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minOrderAmount: offer.minOrderAmount || '',
      maxDiscount: offer.maxDiscount || '',
      validFrom: new Date(offer.validFrom).toISOString().split('T')[0],
      validTo: new Date(offer.validTo).toISOString().split('T')[0],
      isActive: offer.isActive,
      categories: offer.categories || [],
      items: offer.items || []
    });
    setIsFormOpen(true);
    scrollToForm();
  };

  const handleToggleActive = async (offer) => {
    try {
      await toggleOfferStatus({
        offerId: offer.id,
        isActive: !offer.isActive
      });
    } catch (error) {
      console.error("Error toggling offer:", error);
    }
  };

  const generateOfferCode = () => {
    const prefix = formData.discountType === 'percentage' ? 'SAVE' : (formData.discountType === 'fixed' ? 'FLAT' : 'OFFER');
    const random = Math.floor(100 + Math.random() * 900);
    setFormData({ ...formData, code: `${prefix}${formData.discountValue || '50'}${random}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.discountValue || !formData.validFrom || !formData.validTo) {
      alert('Please fill in all required fields');
      return;
    }

    const offerData = {
      title: formData.title,
      description: formData.description,
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : undefined,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      validFrom: new Date(formData.validFrom).getTime(),
      validTo: new Date(formData.validTo).getTime(),
      isActive: formData.isActive,
      categories: formData.categories.length > 0 ? formData.categories : undefined,
      items: formData.items.length > 0 ? formData.items : undefined,
      imageUrl: formData.imageUrl || undefined
    };

    try {
      if (formMode === 'create') {
        await createOffer(offerData);
        alert('Offer created successfully!');
      } else {
        await updateOffer({
          offerId: currentEditId,
          ...offerData
        });
        alert('Offer updated successfully!');
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving offer:", error);
      alert("Failed to save offer. Code might be duplicate.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteOffer({ offerId: id });
        alert("Offer deleted successfully");
      } catch (error) {
        console.error("Error deleting offer:", error);
        alert("Failed to delete offer");
      }
    }
  };

  const filteredOffers = offers.filter(offer => {
    const isExpired = new Date(offer.endDate) < new Date();
    if (activeTab === 'active') return !isExpired;
    return isExpired;
  });

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-content">
            <h1>🎟️ Manage Offers</h1>
            <p>Create and manage discount coupons for your customers.</p>
          </div>
          <div className="header-actions">
            <button
              className="add-btn-primary"
              onClick={handleCreateCustom}
              disabled={isFormOpen && formMode === 'create'}
            >
              <span className="btn-icon">+</span> Create Custom Offer
            </button>
          </div>
        </header>

        {/* Quick Start Templates */}
        {!isFormOpen && (
          <div className="templates-section">
            <h3>✨ Quick Templates</h3>
            <div className="templates-grid">
              {OFFER_TEMPLATES.map(template => (
                <div
                  key={template.id}
                  className="template-card"
                  style={{ background: template.gradient }}
                  onClick={() => handleCreateFromTemplate(template)}
                >
                  <div className="template-icon-circle">✨</div>
                  <h4>{template.name}</h4>
                  <p>Click to Apply</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline Editor Form */}
        {isFormOpen && (
          <div className="offer-editor-container" ref={formRef}>
            <div className="editor-card">
              <div className="editor-header">
                <h2>{formMode === 'create' ? '✨ Create New Offer' : '✏️ Edit Offer'}</h2>
                <button className="close-editor-btn" onClick={() => setIsFormOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleSubmit} className="editor-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Offer Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Summer Sale"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Coupon Code *</label>
                    <div className="code-input-group">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g. SUMMER50"
                        required
                        className="code-input"
                      />
                      <button type="button" className="btn-secondary small" onClick={generateOfferCode}>Generate</button>
                    </div>
                  </div>
                </div>



                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the offer"
                    rows="2"
                  />
                </div>

                {/* Offer Image Upload */}
                <div className="form-group">
                  <label>Offer Image (optional)</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Offer Preview" style={{ maxWidth: 200, marginTop: 8 }} />
                  )}
                </div>

                {/* Category Selector - Multiple */}
                <div className="form-group">
                  <label>Apply to Categories (Optional)</label>
                  <div className="selection-info">
                    {formData.categories.length === 0 ? (
                      <small>No categories selected - Offer applies to all categories</small>
                    ) : (
                      <small>{formData.categories.length} category(ies) selected</small>
                    )}
                  </div>
                  <div className="checkbox-grid">
                    {categories.map(cat => (
                      <label key={cat.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(cat.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ 
                                ...formData, 
                                categories: [...formData.categories, cat.name]
                              });
                            } else {
                              setFormData({ 
                                ...formData, 
                                categories: formData.categories.filter(c => c !== cat.name)
                              });
                            }
                          }}
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Item Selector - Multiple with better UX */}
                <div className="form-group">
                  <label>Apply to Specific Items (Optional)</label>
                  <div className="selection-info">
                    {formData.items.length === 0 ? (
                      <small>No items selected - Offer applies to all items {formData.categories.length > 0 ? 'in selected categories' : ''}</small>
                    ) : (
                      <small>{formData.items.length} item(s) selected</small>
                    )}
                  </div>
                  <div className="items-selection-container">
                    {(formData.categories.length > 0
                      ? menuItems.filter(item => formData.categories.includes(item.category))
                      : menuItems
                    ).length === 0 ? (
                      <p className="no-items-message">No items available {formData.categories.length > 0 ? 'in selected categories' : ''}</p>
                    ) : (
                      <div className="checkbox-grid">
                        {(formData.categories.length > 0
                          ? menuItems.filter(item => formData.categories.includes(item.category))
                          : menuItems
                        ).map(item => (
                          <label key={item.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.items.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ 
                                    ...formData, 
                                    items: [...formData.items, item.id]
                                  });
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    items: formData.items.filter(i => i !== item.id)
                                  });
                                }
                              }}
                            />
                            <span>{item.name} <small className="item-category">({item.category})</small></span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder="e.g. 50"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Min Order Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Discount (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Valid From</label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Valid To</label>
                    <input
                      type="date"
                      value={formData.validTo}
                      onChange={e => setFormData({ ...formData, validTo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group checkbox-row">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    Active Immediately
                  </label>
                </div>

                <div className="editor-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                  <button type="submit" className="save-btn-primary">
                    {formMode === 'create' ? 'Create Offer' : 'Update Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Offers List */}
        <div className="offers-section">
          <div className="offers-tabs">
            <button
              className={`tab-filter-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Offers
            </button>
            <button
              className={`tab-filter-btn ${activeTab === 'expired' ? 'active' : ''}`}
              onClick={() => setActiveTab('expired')}
            >
              Expired / Past
            </button>
          </div>

          <div className="offers-grid">
            {filteredOffers.length === 0 ? (
              <div className="no-offers-state">
                <span className="empty-icon">🎟️</span>
                <h3>No {activeTab} offers found</h3>
                <p>Create a new offer to get started!</p>
              </div>
            ) : (
              filteredOffers.map(offer => (
                <div key={offer.id} className={`offer-ticket ${!offer.isActive ? 'inactive' : ''}`}>
                  <div className="ticket-left" style={{ background: offer.gradient }}>
                    <span className="ticket-hole top"></span>
                    <span className="ticket-hole bottom"></span>
                    <div className="ticket-content">
                      <h2 className="offer-value-display">
                        {offer.discountType === 'fixed' ? `₹${offer.value}` : `${offer.value}%`}
                        <span className="off-text">OFF</span>
                      </h2>
                      <div className="ticket-code">{offer.code}</div>
                    </div>
                  </div>
                  <div className="ticket-right">
                    <div className="ticket-info">
                      <h3>{offer.name}</h3>
                      <p className="ticket-desc">{offer.description}</p>
                      <div className="ticket-meta">
                        <span className="meta-item">📅 {offer.startDate} - {offer.endDate}</span>
                        <span className="meta-item">📦 Min: {offer.minOrder ? `₹${offer.minOrder}` : 'None'}</span>
                      </div>
                    </div>

                    <div className="ticket-actions">
                      <label className="toggle-switch small">
                        <input
                          type="checkbox"
                          checked={offer.isActive}
                          onChange={() => handleToggleActive(offer)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="action-buttons">
                        <button className="icon-btn edit" onClick={() => handleEdit(offer)}>✏️</button>
                        <button className="icon-btn delete" onClick={() => handleDelete(offer.id)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
