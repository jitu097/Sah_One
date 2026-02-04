// ...existing code...

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/menu.css';
import AdminDeleteButton from '../components/AdminDeleteButton';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export default function Menu() {
  // Toggle Best Seller status for a menu item
  const handleToggleBestSeller = async (item) => {
    try {
      await updateMenuItem({
        itemId: item._id,
        isBestSeller: !item.isBestSeller
      });
    } catch (error) {
      console.error("Error toggling best seller status:", error);
      alert("Failed to update best seller status.");
    }
  };
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentEditId, setCurrentEditId] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Convex Queries
  const categoriesRaw = useQuery(api.modules.menu.menu.getAllCategories) || [];
  const menuItemsRaw = useQuery(api.modules.menu.menu.getAllMenuItems) || [];

  // Normalize data for frontend if needed (Convex returns _id, we use it directly)
  const categories = categoriesRaw.map(c => ({
    ...c,
    id: c._id, // Map _id to id for compatibility if needed, but best to use _id
    active: c.isActive
  }));

  const menuItems = menuItemsRaw.map(i => ({
    ...i,
    id: i._id,
    isActive: i.isAvailable, // Map backend isAvailable to frontend isActive
    priceFull: i.fullPrice,
    priceHalf: i.halfPrice,
    hasHalfOption: i.hasHalfPortion,
    isBestSeller: i.isBestSeller || false
  }));

  // Convex Mutations
  const createMenuItem = useMutation(api.modules.menu.menu.createMenuItem);
  const updateMenuItem = useMutation(api.modules.menu.menu.updateMenuItem);
  const deleteMenuItem = useMutation(api.modules.menu.menu.deleteMenuItem);
  const toggleMenuItemAvailability = useMutation(api.modules.menu.menu.toggleMenuItemAvailability);

  const createCategory = useMutation(api.modules.menu.menu.createCategory);
  const deleteCategory = useMutation(api.modules.menu.menu.deleteCategory);
  const toggleCategoryStatus = useMutation(api.modules.menu.menu.toggleCategoryStatus);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    priceHalf: '',
    priceFull: '',
    hasHalfOption: false,
    isActive: true,
    isBestSeller: false
  });

  // Local state for expanded categories in UI
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleAddNew = () => {
    setModalMode('add');
    setCurrentEditId(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      category: categories.length > 0 ? categories[0].name : '',
      priceHalf: '',
      priceFull: '',
      hasHalfOption: false,
      isActive: true,
      isBestSeller: false
    });
    setSelectedImage('');
    setShowModal(true);
    setUploading(false);
    setUploadProgress(0);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await createCategory({
          name: newCategoryName.trim(),
          isActive: true
        });
        setNewCategoryName('');
        setShowCategoryModal(false);
        alert('Category added successfully!');
      } catch (error) {
        console.error("Error creating category:", error);
        alert("Failed to create category");
      }
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const itemsInCategory = menuItems.filter(item => item.category === categoryName);

    if (itemsInCategory.length > 0) {
      alert(`Cannot delete category "${categoryName}" because it has ${itemsInCategory.length} items. Please remove or move the items first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${categoryName}" category?`)) {
      try {
        await deleteCategory({ categoryId });
        alert('Category deleted successfully!');
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  const toggleCategoryActive = async (category) => {
    try {
      await toggleCategoryStatus({
        categoryId: category._id,
        isActive: !category.isActive
      });
    } catch (error) {
      console.error("Error toggling category:", error);
    }
  };

  const getItemsByCategory = (categoryName) => {
    return menuItems.filter(item => item.category === categoryName);
  };

  const getCategoryItemCount = (categoryName) => {
    return menuItems.filter(item => item.category === categoryName).length;
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentEditId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      image: item.image || '',
      category: item.category,
      priceHalf: item.priceHalf || '',
      priceFull: item.priceFull,
      hasHalfOption: item.hasHalfOption,
      isActive: item.isActive,
      isBestSeller: item.isBestSeller || false
    });
    setSelectedImage(item.image || '');
    setShowModal(true);
  };

  const handleToggleActive = async (item) => {
    try {
      await toggleMenuItemAvailability({
        itemId: item._id,
        isAvailable: !item.isActive // toggle current state used in frontend
      });
    } catch (error) {
      console.error("Error toggling item availability:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      // Set the Cloudinary URL
      setSelectedImage(cloudinaryUrl);
      setFormData({ ...formData, image: cloudinaryUrl });
      setUploading(false);
      setUploadProgress(0);

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload image. Please check your Cloudinary configuration.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Please select or upload an image');
      return;
    }
    if (!formData.name || !formData.priceFull || !formData.category) {
      alert('Please fill in required fields');
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      fullPrice: Number(formData.priceFull),
      image: formData.image,
      isAvailable: formData.isActive,
      hasHalfPortion: formData.hasHalfOption,
      halfPrice: formData.hasHalfOption ? Number(formData.priceHalf) : undefined,
      isBestSeller: formData.isBestSeller || false,
    };

    try {
      if (modalMode === 'add') {
        await createMenuItem(itemData);
        alert('Menu item added successfully!');
      } else {
        await updateMenuItem({
          itemId: currentEditId,
          ...itemData
        });
        alert('Menu item updated successfully!');
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem({ itemId: id });
        alert('Item deleted successfully');
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-content">
            <h1>🍽️ Manage Menu</h1>
            <p>
              <span style={{ fontWeight: '700', color: '#ff6b35' }}>{menuItems.length}</span> Total Items • {' '}
              <span style={{ fontWeight: '700', color: '#10b981' }}>{menuItems.filter(i => i.isActive).length}</span> Active • {' '}
              <span style={{ fontWeight: '700', color: '#667eea' }}>{categories.length}</span> Categories
            </p>
          </div>
          <div className="header-actions">
            {/* Optional: Add date or other info here if needed to match dashboard */}
          </div>
        </header>

        <div className="menu-actions-bar">
          <button className="add-item-btn" onClick={handleAddNew}>
            <span className="btn-icon">+</span> Add New Item
          </button>
          <button className="add-category-btn" onClick={() => setShowCategoryModal(true)}>
            <span className="btn-icon">📁</span> Manage Categories
          </button>
          <Link to="/admin/special-serving-hours" className="special-hours-btn">
            <span className="btn-icon">🕐</span> Special Serving Hours
          </Link>
        </div>

        {/* Category-based Menu Display */}
        <div className="category-list">
          {categories.map(category => {
            const categoryItems = getItemsByCategory(category.name);
            const isExpanded = expandedCategories[category.name];

            return (
              <div key={category.id} className={`category-section ${!category.isActive ? 'inactive-category' : ''}`}>
                <div className="category-header" onClick={() => toggleCategory(category.name)}>
                  <div className="category-title">
                    <span className={`category-icon ${isExpanded ? 'expanded' : ''}`}>▶</span>
                    <h2>{category.name}</h2>
                    <span className="item-count-badge">{categoryItems.length} items</span>
                    {!category.isActive && <span className="status-label inactive">Hidden</span>}
                  </div>
                  <div className="category-actions" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle-switch" title="Show/Hide category">
                      <input
                        type="checkbox"
                        checked={category.isActive}
                        onChange={() => toggleCategoryActive(category)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {isExpanded && (
                  <div className="category-items-grid">
                    {categoryItems.length === 0 ? (
                      <div className="empty-category-state">
                        <p>No items in this category yet</p>
                        <button className="add-item-btn-small" onClick={handleAddNew}>
                          + Add First Item
                        </button>
                      </div>
                    ) : (
                      <>
                        {categoryItems.map(item => (
                          <div key={item.id} className={`menu-item-card ${!item.isActive ? 'inactive' : ''}`}>
                            <div className="card-image-container">
                              <img
                                src={item.image || '/image.png'}
                                alt={item.name}
                                className="item-image"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => e.target.src = '/image.png'}
                                srcSet={item.image ? `${item.image}?w=200 200w, ${item.image}?w=400 400w` : undefined}
                                sizes="(max-width: 400px) 200px, 400px"
                              />
                              <span className={`status-pill ${item.isActive ? 'active' : 'inactive'}`}>
                                {item.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>

                            <div className="item-card-body">
                              <div className="item-card-details">
                                <h3>{item.name}</h3>
                                <p className="item-desc">{item.description}</p>
                              </div>

                              <div className="item-pricing-tags">
                                {item.hasHalfOption && (
                                  <span className="price-tag half">Half: ₹{item.priceHalf}</span>
                                )}
                                <span className="price-tag full">Full: ₹{item.priceFull}</span>
                              </div>

                              <div className="item-card-footer">
                                <div className="left-controls">
                                  <label className="modern-toggle" title="Toggle availability">
                                    <input
                                      type="checkbox"
                                      checked={item.isActive}
                                      onChange={() => handleToggleActive(item)}
                                    />
                                    <span className="toggle-track">
                                      <span className="toggle-thumb"></span>
                                    </span>
                                  </label>

                                  <label className="best-seller-toggle" title="Mark as best seller">
                                    <input
                                      type="checkbox"
                                      checked={item.isBestSeller || false}
                                      onChange={() => handleToggleBestSeller(item)}
                                    />
                                    <span className="checkbox-custom">
                                      <svg className="check-icon" viewBox="0 0 12 10">
                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                      </svg>
                                    </span>
                                    <span className="label-text">Best Seller</span>
                                  </label>
                                </div>

                                <div className="action-buttons">
                                  <button className="icon-btn edit" onClick={() => handleEdit(item)} title="Edit">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </button>
                                  <AdminDeleteButton onClick={() => handleDelete(item.id)} title="Delete Item" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add New Item Card */}
                        <div
                          className="add-item-card"
                          onClick={() => {
                            setModalMode('add');
                            setCurrentEditId(null);
                            setFormData({
                              name: '',
                              description: '',
                              image: '',
                              category: category.name,
                              priceHalf: '',
                              priceFull: '',
                              hasHalfOption: false,
                              isActive: true
                            });
                            setSelectedImage('');
                            setShowModal(true);
                            setUploading(false);
                            setUploadProgress(0);
                          }}
                        >
                          <div className="add-item-icon">+</div>
                          <p>Add New Item</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalMode === 'add' ? 'Add New Item' : 'Edit Item'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Butter Chicken"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description of the item"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label>Category</label>
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
                  <div className="form-group half checkbox-group centered">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={formData.hasHalfOption}
                        onChange={(e) => setFormData({ ...formData, hasHalfOption: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      Enable Half Portion
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <div className="image-upload-area">
                    {selectedImage ? (
                      <div className="image-preview-wrapper">
                        <img src={selectedImage} alt="Preview" loading="lazy" decoding="async" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setSelectedImage('');
                            setFormData({ ...formData, image: '' });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="upload-trigger">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        <div className="upload-content">
                          <span className="upload-icon">☁️</span>
                          <span>{uploading ? `Uploading ${uploadProgress}%...` : 'Click to Upload Image'}</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  {formData.hasHalfOption && (
                    <div className="form-group half">
                      <label>Half Price (₹)</label>
                      <input
                        type="number"
                        value={formData.priceHalf}
                        onChange={(e) => setFormData({ ...formData, priceHalf: e.target.value })}
                        required={formData.hasHalfOption}
                        min="0"
                      />
                    </div>
                  )}
                  <div className="form-group half">
                    <label>Full Price (₹)</label>
                    <input
                      type="number"
                      value={formData.priceFull}
                      onChange={(e) => setFormData({ ...formData, priceFull: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    Active (Visible to users)
                  </label>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {modalMode === 'add' ? 'Create Item' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
            <div className="modal-content standard-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Manage Categories</h2>
                <button className="modal-close" onClick={() => setShowCategoryModal(false)}>×</button>
              </div>

              <div className="modal-body">
                <div className="add-category-row">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="input-field"
                  />
                  <button className="btn-primary slim" onClick={handleAddCategory}>
                    Add
                  </button>
                </div>

                <div className="categories-manage-list">
                  <h3>Existing Categories</h3>
                  <div className="categories-scroll-area">
                    {categories.map(category => (
                      <div key={category.id} className="category-manage-row">
                        <div className="cat-info">
                          <strong>{category.name}</strong>
                          <span className="sub-text">({getCategoryItemCount(category.name)} items)</span>
                        </div>
                        <div className="cat-actions">
                          <label className="toggle-switch small">
                            <input
                              type="checkbox"
                              checked={category.isActive}
                              onChange={() => toggleCategoryActive(category)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                          <AdminDeleteButton
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                            title="Delete category"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
