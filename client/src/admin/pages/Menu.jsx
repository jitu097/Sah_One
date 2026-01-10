import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/menu.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export default function Menu() {
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
    hasHalfOption: i.hasHalfPortion
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
    isActive: true
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
      isActive: true
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
      isActive: item.isActive
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
        <div className="admin-header">
          <h1>🍽️ Manage Menu</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Total Items: {menuItems.length} | Active: {menuItems.filter(i => i.isActive).length} | Categories: {categories.length}
          </p>
        </div>

        <div className="menu-actions">
          <button className="add-item-btn" onClick={handleAddNew}>
            + Add New Item
          </button>
          <button className="add-category-btn" onClick={() => setShowCategoryModal(true)}>
            📁 Manage Categories
          </button>
          <Link to="/admin/special-serving-hours" className="special-hours-btn">
            🕐 Special Serving Hours
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
                    <span className="category-icon">{isExpanded ? '▼' : '▶'}</span>
                    <h2>{category.name}</h2>
                    <span className="item-count">({categoryItems.length} items)</span>
                    {!category.isActive && <span className="category-inactive-badge">Hidden</span>}
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
                  <div className="category-items">
                    {categoryItems.length === 0 ? (
                      <div className="empty-category">
                        <p>No items in this category yet</p>
                        <button className="add-item-btn-small" onClick={handleAddNew}>
                          + Add First Item
                        </button>
                      </div>
                    ) : (
                      categoryItems.map(item => (
                        <div key={item.id} className={`admin-item ${!item.isActive ? 'inactive-item' : ''}`}>
                          <img
                            src={item.image || '/image.png'}
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
                                onChange={() => handleToggleActive(item)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                            <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                          </div>
                        </div>
                      ))
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
                  <div className="image-upload-section">
                    {selectedImage && (
                      <div className="selected-image-preview">
                        <img src={selectedImage} alt="Selected" onError={(e) => e.target.src = '/image.png'} />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => {
                            setSelectedImage('');
                            setFormData({ ...formData, image: '' });
                          }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    )}
                    
                    {!selectedImage && (
                      <label className="upload-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          style={{ display: 'none' }}
                        />
                        <span>
                          {uploading ? `📤 Uploading... ${uploadProgress}%` : '📤 Upload Image to Cloudinary'}
                        </span>
                      </label>
                    )}
                    
                    {uploading && (
                      <div className="upload-progress-bar">
                        <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
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

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📁 Manage Categories</h2>
                <button className="modal-close" onClick={() => setShowCategoryModal(false)}>×</button>
              </div>

              <div style={{ padding: '25px' }}>
                <div className="form-group">
                  <label>Add New Category</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name (e.g., Rolls, Pizza)"
                      style={{ flex: 1 }}
                    />
                    <button className="submit-btn" onClick={handleAddCategory}>
                      Add
                    </button>
                  </div>
                </div>

                <div className="category-manage-list">
                  <h3 style={{ marginBottom: '15px', color: '#333' }}>Existing Categories</h3>
                  {categories.map(category => (
                    <div key={category.id} className="category-manage-item">
                      <div>
                        <strong>{category.name}</strong>
                        <span style={{ color: '#666', fontSize: '0.9rem', marginLeft: '10px' }}>
                          ({getCategoryItemCount(category.name)} items)
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={category.isActive}
                            onChange={() => toggleCategoryActive(category)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <button
                          className="delete-btn-small"
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          title="Delete category"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
