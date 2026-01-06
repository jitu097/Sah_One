import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/servingHours.css';

// Available images in public folder
const PUBLIC_IMAGES = [
  'bhujia roti.jpeg',
  'Breakfast.jpeg',
  'chola bhatura.jpeg',
  'chola.jpeg',
  'Dinner.jpeg',
  'eggpratha.jpeg',
  'hamburger.png',
  'lunch.jpeg',
  'poha.jpeg',
  'ricethali.jpeg',
  'sattu paratha.jpeg',
  'tadkaroti.jpeg',
  'parties.png',
  'image.png'
];

export default function SpecialServingHours() {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Breakfast', 
      isActive: true, 
      icon: '🌅',
      start: '06:00', 
      end: '11:00',
      color: '#FF9800'
    },
    { 
      id: 2, 
      name: 'Lunch', 
      isActive: true, 
      icon: '☀️',
      start: '11:00', 
      end: '16:00',
      color: '#4CAF50'
    },
    { 
      id: 3, 
      name: 'Dinner', 
      isActive: true, 
      icon: '🌙',
      start: '18:00', 
      end: '23:00',
      color: '#2196F3'
    }
  ]);

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Poha',
      description: 'Traditional Indian breakfast',
      image: 'poha.jpeg',
      category: 'Breakfast',
      priceHalf: 40,
      priceFull: 80,
      isActive: true,
      hasHalfOption: true
    },
    {
      id: 2,
      name: 'Veg Roll',
      description: 'Fresh vegetables wrapped in soft paratha',
      image: 'hamburger.png',
      category: 'Lunch',
      priceHalf: 40,
      priceFull: 80,
      isActive: true,
      hasHalfOption: true
    },
    {
      id: 3,
      name: 'Paneer Roll',
      description: 'Cottage cheese with special sauce',
      image: 'hamburger.png',
      category: 'Dinner',
      priceHalf: 60,
      priceFull: 120,
      isActive: true,
      hasHalfOption: true
    }
  ]);

  const [expandedCategories, setExpandedCategories] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [currentTimeCategory, setCurrentTimeCategory] = useState(null);
  const [tempTime, setTempTime] = useState({ start: '', end: '' });
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    priceHalf: '',
    priceFull: '',
    hasHalfOption: true,
    isActive: true
  });

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const toggleCategoryActive = (categoryId) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleEditTime = (category) => {
    setCurrentTimeCategory(category);
    setTempTime({ start: category.start, end: category.end });
    setShowTimeModal(true);
  };

  const handleTimeChange = (field, value) => {
    setTempTime(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTime = () => {
    setCategories(categories.map(cat => 
      cat.id === currentTimeCategory.id 
        ? { ...cat, start: tempTime.start, end: tempTime.end } 
        : cat
    ));
    alert(`Saved ${currentTimeCategory.name} hours: ${tempTime.start} - ${tempTime.end}`);
    setShowTimeModal(false);
    setCurrentTimeCategory(null);
  };

  const getItemsByCategory = (categoryName) => {
    return menuItems.filter(item => item.category === categoryName);
  };

  const handleAddNew = () => {
    setModalMode('add');
    setFormData({
      name: '',
      description: '',
      image: '',
      category: categories[0]?.name || '',
      priceHalf: '',
      priceFull: '',
      hasHalfOption: true,
      isActive: true
    });
    setSelectedImage('');
    setUploadedImage(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.category,
      priceHalf: item.priceHalf || '',
      priceFull: item.priceFull,
      hasHalfOption: item.hasHalfOption,
      isActive: item.isActive
    });
    setSelectedImage(item.image);
    setShowModal(true);
  };

  const handleToggleActive = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const handleImageSelect = (imageName) => {
    setSelectedImage(imageName);
    setFormData({ ...formData, image: imageName });
    setUploadedImage(null);
    setShowImagePicker(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      setUploadedImage(fileName);
      setSelectedImage(fileName);
      setFormData({ ...formData, image: fileName });
      alert(`Image "${fileName}" will be saved to public folder`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      alert('Please select or upload an image');
      return;
    }

    if (modalMode === 'add') {
      const newItem = {
        id: Date.now(),
        ...formData,
        priceHalf: formData.hasHalfOption ? Number(formData.priceHalf) : 0,
        priceFull: Number(formData.priceFull)
      };
      setMenuItems([...menuItems, newItem]);
      alert('Menu item added successfully!');
    } else {
      setMenuItems(menuItems.map(item =>
        item.id === currentItem.id
          ? {
              ...item,
              ...formData,
              priceHalf: formData.hasHalfOption ? Number(formData.priceHalf) : 0,
              priceFull: Number(formData.priceFull)
            }
          : item
      ));
      alert('Menu item updated successfully!');
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>🕐 Special Serving Hours</h1>
            <p style={{ color: '#666', marginTop: '5px' }}>
              Manage serving hours and menu items for each meal time
            </p>
          </div>
          <Link to="/admin/menu" className="back-btn">
            ← Back to Menu
          </Link>
        </div>

        <div className="menu-actions">
          <button className="add-item-btn" onClick={handleAddNew}>
            + Add New Item
          </button>
        </div>

        {/* Category-based Display */}
        <div className="category-list">
          {categories.map(category => {
            const categoryItems = getItemsByCategory(category.name);
            const isExpanded = expandedCategories[category.name];
            
            return (
              <div key={category.id} className={`category-section ${!category.isActive ? 'inactive-category' : ''}`}>
                <div 
                  className="category-header" 
                  onClick={() => toggleCategory(category.name)}
                  style={{ background: category.color }}
                >
                  <div className="category-title">
                    <span className="category-icon">{isExpanded ? '▼' : '▶'}</span>
                    <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{category.icon}</span>
                    <h2>{category.name}</h2>
                    <span className="item-count">({categoryItems.length} items)</span>
                    {!category.isActive && <span className="category-inactive-badge">OFF</span>}
                  </div>
                  <div className="category-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch" title="Enable/Disable category">
                      <input 
                        type="checkbox" 
                        checked={category.isActive}
                        onChange={() => toggleCategoryActive(category.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {isExpanded && (
                  <div className="category-content">
                    {/* Time Controls */}
                    <div className="time-section">
                      <div className="time-display-row">
                        <div>
                          <h3>Serving Hours</h3>
                          <p className="time-display">
                            <span className="time-label">🕐</span>
                            <strong>{category.start}</strong> to <strong>{category.end}</strong>
                          </p>
                        </div>
                        <button 
                          className="edit-time-btn" 
                          onClick={() => handleEditTime(category)}
                        >
                          ✏️ Edit Time
                        </button>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="items-section">
                      <h3>Menu Items</h3>
                      {categoryItems.length === 0 ? (
                        <div className="empty-category">
                          <p>No items in this category yet</p>
                          <button className="add-item-btn-small" onClick={handleAddNew}>
                            + Add First Item
                          </button>
                        </div>
                      ) : (
                        <div className="category-items">
                          {categoryItems.map(item => (
                            <div key={item.id} className={`admin-item ${!item.isActive ? 'inactive-item' : ''}`}>
                              <img 
                                src={`/${item.image}`} 
                                alt={item.name}
                                className="item-image"
                                onError={(e) => e.target.src = '/image.png'}
                              />
                              <div className="item-details">
                                <h3>
                                  {item.name}
                                  <span className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                                    {item.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </h3>
                                <p>{item.description}</p>
                                <div className="item-pricing">
                                  {item.hasHalfOption && (
                                    <span className="item-price">Half: ₹{item.priceHalf}</span>
                                  )}
                                  <span className="item-price">Full: ₹{item.priceFull}</span>
                                </div>
                              </div>
                              <div className="item-actions">
                                <label className="toggle-switch">
                                  <input 
                                    type="checkbox" 
                                    checked={item.isActive}
                                    onChange={() => handleToggleActive(item.id)}
                                  />
                                  <span className="toggle-slider"></span>
                                </label>
                                <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalMode === 'add' ? '➕ Add New Menu Item' : '✏️ Edit Menu Item'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter item name"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter item description"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Image *</label>
                  <div className="image-selection">
                    {selectedImage && (
                      <div className="selected-image-preview">
                        <img src={`/${selectedImage}`} alt="Selected" onError={(e) => e.target.src = '/image.png'} />
                        <p>{selectedImage}</p>
                      </div>
                    )}
                    <div className="image-buttons">
                      <button 
                        type="button" 
                        className="select-existing-btn"
                        onClick={() => setShowImagePicker(!showImagePicker)}
                      >
                        📁 Select from Existing
                      </button>
                      <label className="upload-new-btn">
                        📤 Upload New Image
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {showImagePicker && (
                      <div className="image-picker">
                        <div className="image-grid">
                          {PUBLIC_IMAGES.map((img) => (
                            <div 
                              key={img}
                              className={`image-option ${selectedImage === img ? 'selected' : ''}`}
                              onClick={() => handleImageSelect(img)}
                            >
                              <img src={`/${img}`} alt={img} onError={(e) => e.target.src = '/image.png'} />
                              <p>{img}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.hasHalfOption}
                      onChange={(e) => setFormData({ ...formData, hasHalfOption: e.target.checked })}
                    />
                    <span>Has Half Portion Option</span>
                  </label>
                </div>

                <div className="price-row">
                  {formData.hasHalfOption && (
                    <div className="form-group">
                      <label>Half Price (₹) *</label>
                      <input
                        type="number"
                        value={formData.priceHalf}
                        onChange={(e) => setFormData({ ...formData, priceHalf: e.target.value })}
                        required={formData.hasHalfOption}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Full Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.priceFull}
                      onChange={(e) => setFormData({ ...formData, priceFull: e.target.value })}
                      required
                      min="0"
                      placeholder="0"
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

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {modalMode === 'add' ? 'Add Item' : 'Update Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Time Edit Modal */}
        {showTimeModal && currentTimeCategory && (
          <div className="modal-overlay" onClick={() => setShowTimeModal(false)}>
            <div className="time-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🕐 Edit {currentTimeCategory.name} Hours</h2>
                <button className="modal-close" onClick={() => setShowTimeModal(false)}>×</button>
              </div>

              <div className="time-modal-body">
                <div className="time-edit-controls">
                  <div className="time-input-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={tempTime.start}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                    />
                  </div>
                  <span className="time-separator">to</span>
                  <div className="time-input-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={tempTime.end}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowTimeModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="submit-btn" onClick={handleSaveTime}>
                    💾 Save Hours
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
