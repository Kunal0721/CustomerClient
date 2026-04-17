import React, { useState, useEffect } from 'react';
import CustomerTable from './CustomerTable';
import CustomerModal from './CustomerModal';
import Pagination from './Pagination';
import * as api from '../services/api';

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [size] = useState(5); // You can change items per page here
  const [totalPages, setTotalPages] = useState(0);
  
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      loadCustomers();
    }
  }, [page, isSearching]);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.fetchCustomers(page, size);
      // Assuming Spring Boot Pageable response format
      if (data.content !== undefined) {
        setCustomers(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        // Fallback if API just returns an array
        setCustomers(data);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Failed to fetch customers from server. ' + err.message);
      // Mock data for UI demonstration if backend is down
      console.warn("Using mock data due to backend failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await api.fetchCustomerById(searchId);
      // Backend should return a single Customer object or error 404
      if (data && data.id) {
        setCustomers([data]);
        setTotalPages(1);
        setPage(0);
        setIsSearching(true);
      } else {
        setCustomers([]);
        setTotalPages(0);
      }
    } catch (err) {
      setError('Customer not found or error fetching data.');
      setCustomers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setIsSearching(false); // This triggers useEffect to reload paginated customers
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (customer) => {
    setEditingCustomer(customer);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.deleteCustomer(id);
        loadCustomers();
      } catch (err) {
        setError('Error deleting customer: ' + err.message);
      }
    }
  };

  const handleSave = async (customerData) => {
    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.id, customerData);
      } else {
        await api.createCustomer(customerData);
      }
      setIsModalOpen(false);
      loadCustomers();
    } catch (err) {
      setError('Error saving customer: ' + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Customer Portal</h1>
        <div className="header-actions">
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search by ID..." 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            {isSearching ? (
              <button type="button" className="btn-cancel btn-small" onClick={clearSearch}>Clear</button>
            ) : (
              <button type="submit" className="btn-primary btn-small">Search</button>
            )}
          </form>
          <button className="btn-primary btn-add" onClick={handleAdd}>+ Add</button>
        </div>
      </header>

      {error && <div className="toast-error">{error}</div>}

      {loading ? (
        <div className="loader">Loading customers...</div>
      ) : (
        <>
          <CustomerTable
            customers={customers}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingCustomer}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default CustomerDashboard;
