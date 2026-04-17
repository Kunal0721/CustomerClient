import React, { useState, useEffect } from 'react';

const CustomerModal = ({ isOpen, onClose, onSave, initialData, isViewMode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || initialData.first_name || '',
        lastName: initialData.lastName || initialData.last_name || '',
        email: initialData.email || '',
        gender: initialData.gender || ''
      });
    } else {
      setFormData({ firstName: '', lastName: '', email: '', gender: '' });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // We send both camelCase and snake_case to ensure the Spring Boot backend
    // maps them properly regardless of how your Java Customer model is defined.
    // Also including 'id' in the payload just in case your backend PUT requires it.
    const payload = {
      ...formData,
      id: initialData ? initialData.id : null,
      first_name: formData.firstName,
      last_name: formData.lastName
    };
    
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel slide-up">
        <h2>
          {isViewMode 
            ? 'View Customer Details' 
            : initialData ? 'Update Customer' : 'Add New Customer'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              required 
              disabled={isViewMode}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              required 
              disabled={isViewMode}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              disabled={isViewMode}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required disabled={isViewMode}>
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button type="submit" className="btn-primary">Save</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
