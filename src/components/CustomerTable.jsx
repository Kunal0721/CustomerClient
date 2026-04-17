import React from 'react';

const CustomerTable = ({ customers, onView, onEdit, onDelete }) => {
  return (
    <div className="table-container fade-in">
      <table className="glass-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">No customers found.</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="table-row">
                <td>{customer.id}</td>
                <td>{customer.firstName || customer.first_name}</td>
                <td>{customer.lastName || customer.last_name}</td>
                <td>{customer.email}</td>
                <td>{customer.gender}</td>
                <td>
                  <button className="btn-page btn-small" onClick={() => onView(customer)}>View</button>
                  <button className="btn-edit btn-small" onClick={() => onEdit(customer)}>Edit</button>
                  <button className="btn-delete btn-small" onClick={() => onDelete(customer.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
