import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/offers.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

// Offer Templates (Client-side helpers)
const OFFER_TEMPLATES = [
  { id: 1, name: 'Buy 1 Get 1', type: 'bogo', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: '50% Off', type: 'percentage', value: 50, gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  { id: 3, name: 'Flat ₹100 Off', type: 'flat', value: 100, gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { id: 4, name: 'Free Delivery', type: 'free_delivery', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
];

export default function Offers() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit'
  const [currentEditId, setCurrentEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'expired'

  // Convex Hooks
  const offersRaw = useQuery(api.modules.offers.offers.getAllOffers) || [];
  const createOffer = useMutation(api.modules.offers.offers.createOffer);
  const updateOffer = useMutation(api.modules.offers.offers.updateOffer);
  const deleteOffer = useMutation(api.modules.offers.offers.deleteOffer);
  const toggleOfferStatus = useMutation(api.modules.offers.offers.toggleOfferStatus);

  // Map backend offers to frontend display format
  const offers = offersRaw.map(o => ({
    ...o,
    id: o._id,
    name: o.title, // Backend uses title, frontend used name
    type: o.discountType === 'percentage' && o.discountValue === 100 ? 'bogo' : (o.discountType === 'fixed' ? 'flat' : o.discountType),
    value: o.discountValue,
    minOrder: o.minOrderAmount,
    startDate: new Date(o.validFrom).toISOString().split('T')[0],
    endDate: new Date(o.validTo).toISOString().split('T')[0],
    // Assign a gradient based on type or random (deterministic)
    gradient: OFFER_TEMPLATES.find(t => t.type === o.discountType)?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
    isActive: true
  });

  const handleCreateFromTemplate = (template) => {
    setModalMode('create');
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
      isActive: true
    });
    setShowModal(true);
  };

  const handleCreateCustom = () => {
    setModalMode('create');
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
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (offer) => {
    setModalMode('edit');
    setCurrentEditId(offer.id);

    // Map frontend/backend fields
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
      isActive: offer.isActive
    });
    setShowModal(true);
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
      isActive: formData.isActive
    };

    try {
      if (modalMode === 'create') {
        await createOffer(offerData);
        alert('Offer created successfully!');
      } else {
        await updateOffer({
          offerId: currentEditId,
          ...offerData
        });
        alert('Offer updated successfully!');
      }
      setShowModal(false);
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
        <div className="admin-header">
          <h1>🎁 Manage Offers</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Active Offers: {offers.filter(o => o.isActive).length} | Total: {offers.length}
          </p>
        </div>

        {/* Quick Create from Template */}
        <div className="templates-section">
          <h3>🚀 Quick Create</h3>
          <div className="templates-grid">
            {OFFER_TEMPLATES.map(template => (
              <div
                key={template.id}
                className="template-card"
                style={{ background: template.gradient }}
                onClick={() => handleCreateFromTemplate(template)}
              >
                <span className="template-icon">✨</span>
                <h4>{template.name}</h4>
                <p>Click to create</p>
              </div>
            ))}
            <div className="template-card create-custom" onClick={handleCreateCustom}>
              <span className="template-icon">➕</span>
              <h4>Custom Offer</h4>
              <p>Create from scratch</p>
            </div>
          </div>
        </div>

        {/* Offers List */}
        <div className="offers-section">
          <div className="offers-tabs">
            <button
              className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Offers
            </button>
            <button
              className={`tab-btn ${activeTab === 'expired' ? 'active' : ''}`}
              onClick={() => setActiveTab('expired')}
            >
              Expired / Past
            </button>
          </div>

          <div className="offers-grid">
            {filteredOffers.length === 0 ? (
              <div className="no-offers">
                <p>No {activeTab} offers found.</p>
              </div>
            ) : (
              filteredOffers.map(offer => (
                <div key={offer.id} className={`offer-card ${!offer.isActive ? 'inactive' : ''}`}>
                  <div className="offer-header" style={{ background: offer.gradient }}>
                    <div className="offer-code">{offer.code}</div>
                    <div className="offer-actions">
                      <button className="icon-btn edit" onClick={() => handleEdit(offer)}>✏️</button>
                      <button className="icon-btn delete" onClick={() => handleDelete(offer.id)}>🗑️</button>
                    </div>
                  </div>
                  <div className="offer-body">
                    <h3>{offer.name}</h3>
                    <p>{offer.description}</p>
                    <div className="offer-details">
                      <div className="detail">
                        <span className="label">Value:</span>
                        <span className="value">
                          {offer.discountType === 'fixed' ? `₹${offer.value}` : `${offer.value}%`}
                        </span>
                      </div>
                      <div className="detail">
                        <span className="label">Min Order:</span>
                        <span className="value">{offer.minOrder ? `₹${offer.minOrder}` : 'None'}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Valid:</span>
                        <span className="value">{offer.startDate} to {offer.endDate}</span>
                      </div>
                    </div>
                    <div className="offer-footer">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={offer.isActive}
                          onChange={() => handleToggleActive(offer)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">{offer.isActive ? 'Active' : 'Inactive'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content offer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalMode === 'create' ? '✨ Create New Offer' : '✏️ Edit Offer'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
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
                      />
                      <button type="button" className="generate-btn" onClick={generateOfferCode}>Generate</button>
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

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">{modalMode === 'create' ? 'Create Offer' : 'Update Offer'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
