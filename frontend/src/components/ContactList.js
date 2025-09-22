// frontend/src/components/ContactList.js
import React from 'react';
import './ContactList.css';

const ContactList = ({ contacts, onDeleteContact, isLoading, apiBaseUrl }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await onDeleteContact(id);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return <div className="no-contacts">No contacts found. Add some contacts to get started!</div>;
  }

  return (
    <div className="contact-list-container">
      <h2>Contacts</h2>
      <div className="contact-list">
        {contacts.map(contact => (
          <div key={contact.id} className="contact-item">
            <div className="contact-info">
              <h3>{contact.name}</h3>
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
            </div>
            <button 
              onClick={() => handleDelete(contact.id)}
              className="delete-btn"
              aria-label={`Delete ${contact.name}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;