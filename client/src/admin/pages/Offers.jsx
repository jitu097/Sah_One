import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/offers.css';

// Sample categories and items (in real app, fetch from backend)
const CATEGORIES = [
  { id: 1, name: 'Rolls' },
  { id: 2, name: 'Chowmein' },
  { id: 3, name: 'Parathas' },
  { id: 4, name: 'Rice Items' },
  { id: 5, name: 'Breakfast' },
  { id: 6, name: 'Thali' }
];

const MENU_ITEMS = [
  { id: 1, name: 'Veg Roll', category: 'Rolls' },
  { id: 2, name: 'Paneer Roll', category: 'Rolls' },
  { id: 3, name: 'Veg Chowmein', category: 'Chowmein' },
  { id: 4, name: 'Poha', category: 'Breakfast' },
  { id: 5, name: 'Sattu Paratha', category: 'Parathas' },
  { id: 6, name: 'Rice Thali', category: 'Thali' }
];

// Offer Templates
const OFFER_TEMPLATES = [
  { id: 1, name: 'Buy 1 Get 1', type: 'bogo', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: '10% Off', type: 'percentage', value: 10, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, name: 'Up to 20% Off', type: 'percentage', value: 20, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, name: 'Up to 50% Off', type: 'percentage', value: 50, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 5, name: 'Flat ₹50 Off', type: 'flat', value: 50, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 6, name: 'Flat ₹100 Off', type: 'flat', value: 100, gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { id: 7, name: 'Free Delivery', type: 'free_delivery', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
];

export default function Offers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      template: OFFER_TEMPLATES[0],
      title: 'Buy 1 Get 1',
      description: 'On all Rolls',
      code: 'BOGO50',
      applyType: 'category', // 'category' or 'items' or 'all'
      selectedCategories: ['Rolls'],
      selectedItems: [],
      minOrder: 0,
      maxDiscount: 0,
      validFrom: '',
      validTo: '',
      isActive: true
    },
    {
      id: 2,
      template: OFFER_TEMPLATES[2],
      title: 'Up to 20% Off',
      description: 'On Breakfast items',
      code: 'BREAK20',
      applyType: 'category',
      selectedCategories: ['Breakfast'],
      selectedItems: [],
      minOrder: 100,
      maxDiscount: 50,
      validFrom: '',
      validTo: '',
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('template'); // 'template' or 'custom'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    applyType: 'all',
    selectedCategories: [],
    selectedItems: [],
    minOrder: 0,
    maxDiscount: 0,
    validFrom: '',
    validTo: '',
    customGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    isActive: true
  });

  const handleCreateFromTemplate = (template) => {
    setSelectedTemplate(template);
    setModalMode('template');
    setEditMode(false);
    setFormData({
      title: template.name,
      description: '',
      code: '',
      applyType: 'all',
      selectedCategories: [],
      selectedItems: [],
      minOrder: 0,
      maxDiscount: 0,
      validFrom: '',
      validTo: '',
      customGradient: template.gradient,
      isActive: true
    });
    setShowModal(true);
  };

  const handleCreateCustom = () => {
    setSelectedTemplate(null);
    setModalMode('custom');
    setEditMode(false);
    setFormData({
      title: '',
      description: '',
      code: '',
      applyType: 'all',
      selectedCategories: [],
      selectedItems: [],
      minOrder: 0,
      maxDiscount: 0,
      validFrom: '',
      validTo: '',
      customGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (offer) => {
    setCurrentOffer(offer);
    setSelectedTemplate(offer.template);
    setModalMode(offer.template ? 'template' : 'custom');
    setEditMode(true);
    setFormData({
      title: offer.title,
      description: offer.description,
      code: offer.code,
      applyType: offer.applyType,
      selectedCategories: offer.selectedCategories || [],
      selectedItems: offer.selectedItems || [],
      minOrder: offer.minOrder,
      maxDiscount: offer.maxDiscount,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      customGradient: offer.template?.gradient || offer.customGradient,
      isActive: offer.isActive
    });
    setShowModal(true);
  };

  const handleToggleActive = (id) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, isActive: !offer.isActive } : offer
    ));
  };

  const handleCategoryToggle = (categoryName) => {
    const isSelected = formData.selectedCategories.includes(categoryName);
    setFormData({
      ...formData,
      selectedCategories: isSelected
        ? formData.selectedCategories.filter(c => c !== categoryName)
        : [...formData.selectedCategories, categoryName]
    });
  };

  const handleItemToggle = (itemId) => {
    const isSelected = formData.selectedItems.includes(itemId);
    setFormData({
      ...formData,
      selectedItems: isSelected
        ? formData.selectedItems.filter(i => i !== itemId)
        : [...formData.selectedItems, itemId]
    });
  };

  const generateOfferCode = () => {
    const randomCode = 'OFFER' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, code: randomCode });
  };

  const getAppliedItemsText = () => {
    if (formData.applyType === 'all') return 'All Menu Items';
    if (formData.applyType === 'category') {
      return formData.selectedCategories.length > 0 
        ? formData.selectedCategories.join(', ')
        : 'No categories selected';
    }
    if (formData.applyType === 'items') {
      const selectedItemNames = MENU_ITEMS
        .filter(item => formData.selectedItems.includes(item.id))
        .map(item => item.name);
      return selectedItemNames.length > 0 
        ? selectedItemNames.join(', ')
        : 'No items selected';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      alert('Please enter or generate an offer code');
      return;
    }

    const newOffer = {
      id: editMode ? currentOffer.id : Date.now(),
      template: selectedTemplate,
      ...formData,
      customGradient: formData.customGradient
    };

    if (editMode) {
      setOffers(offers.map(offer => offer.id === currentOffer.id ? newOffer : offer));
      alert('Offer updated successfully!');
    } else {
      setOffers([...offers, newOffer]);
      alert('Offer created successfully!');
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🎁 Manage Offers</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Total Offers: {offers.length} | Active: {offers.filter(o => o.isActive).length}
          </p>
        </div>

        <div className="offer-actions">
          <button className="create-custom-btn" onClick={handleCreateCustom}>
            ✨ Create Custom Offer
          </button>
        </div>

        {/* Active Offers */}
        <div className="offers-section">
          <h2>🎯 Active Offers</h2>
          <div className="offers-grid">
            {offers.map(offer => (
              <div key={offer.id} className={`offer-poster ${!offer.isActive ? 'inactive-offer' : ''}`}>
                <div className="poster-visual" style={{ background: offer.template?.gradient || offer.customGradient }}>
                  <div className="poster-content">
                    <h2>{offer.title}</h2>
                    <p className="poster-description">{offer.description}</p>
                    <div className="poster-applies-to">
                      {offer.applyType === 'all' && <span>✨ On All Items</span>}
                      {offer.applyType === 'category' && offer.selectedCategories.length > 0 && (
                        <span>📁 {offer.selectedCategories.join(', ')}</span>
                      )}
                      {offer.applyType === 'items' && offer.selectedItems.length > 0 && (
                        <span>🍽️ {offer.selectedItems.length} Selected Items</span>
                      )}
                    </div>
                    <div className="poster-code">CODE: {offer.code}</div>
                    {offer.minOrder > 0 && (
                      <div className="poster-condition">Min Order: ₹{offer.minOrder}</div>
                    )}
                  </div>
                  <div className="poster-status">
                    <span className={`status-badge ${offer.isActive ? 'active' : 'inactive'}`}>
                      {offer.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
                
                <div className="poster-actions">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={offer.isActive}
                      onChange={() => handleToggleActive(offer.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <button className="edit-btn" onClick={() => handleEdit(offer)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(offer.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Templates */}
        <div className="templates-section">
          <h2>📋 Quick Offer Templates</h2>
          <div className="template-grid">
            {OFFER_TEMPLATES.map(template => (
              <div 
                key={template.id} 
                className="template-card"
                style={{ background: template.gradient }}
                onClick={() => handleCreateFromTemplate(template)}
              >
                <div className="template-content">
                  <h3>{template.name}</h3>
                  <p>Click to use this template</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Creating/Editing Offers */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content offer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editMode ? '✏️ Edit Offer' : '➕ Create New Offer'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Poster Preview */}
                  <div className="poster-preview">
                    <div className="preview-label">Poster Preview</div>
                    <div className="preview-poster" style={{ background: formData.customGradient }}>
                      <h2>{formData.title || 'Offer Title'}</h2>
                      <p>{formData.description || 'Description'}</p>
                      <div className="preview-applies">{getAppliedItemsText()}</div>
                      <div className="preview-code">CODE: {formData.code || 'XXXXX'}</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Offer Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g., Buy 1 Get 1, 50% Off"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., On all Rolls"
                    />
                  </div>

                  <div className="form-group">
                    <label>Offer Code *</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                        placeholder="e.g., BOGO50"
                        style={{ flex: 1 }}
                      />
                      <button type="button" className="generate-btn" onClick={generateOfferCode}>
                        Generate
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Apply To *</label>
                    <select
                      value={formData.applyType}
                      onChange={(e) => setFormData({ ...formData, applyType: e.target.value })}
                      required
                    >
                      <option value="all">All Menu Items</option>
                      <option value="category">Specific Categories</option>
                      <option value="items">Specific Items</option>
                    </select>
                  </div>

                  {formData.applyType === 'category' && (
                    <div className="form-group">
                      <label>Select Categories</label>
                      <div className="selection-grid">
                        {CATEGORIES.map(cat => (
                          <label key={cat.id} className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={formData.selectedCategories.includes(cat.name)}
                              onChange={() => handleCategoryToggle(cat.name)}
                            />
                            <span>{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.applyType === 'items' && (
                    <div className="form-group">
                      <label>Select Items</label>
                      <div className="selection-grid">
                        {MENU_ITEMS.map(item => (
                          <label key={item.id} className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={formData.selectedItems.includes(item.id)}
                              onChange={() => handleItemToggle(item.id)}
                            />
                            <span>{item.name} <small>({item.category})</small></span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label>Minimum Order (₹)</label>
                      <input
                        type="number"
                        value={formData.minOrder}
                        onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Max Discount (₹)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Valid From</label>
                      <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Valid To</label>
                      <input
                        type="date"
                        value={formData.validTo}
                        onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span>Active (Show to users)</span>
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editMode ? 'Update Offer' : 'Create Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
