// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import './App.css';

// Backend base URL - update this to your Render URL
const API_BASE_URL = 'https://contact-book-backend-o0y4.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const fetchContacts = useCallback(async (page = 1) => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const data = await response.json();
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user, fetchContacts]);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthMode('login');
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setContacts([]);
    }
  };

  const switchToSignup = () => {
    setAuthMode('signup');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  const handleContactAdded = (newContact) => {
    if (currentPage === 1) {
      fetchContacts(1);
    } else {
      setCurrentPage(1);
      fetchContacts(1);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
      
      fetchContacts(currentPage);
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('Failed to delete contact. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchContacts(page);
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-app">
        {authMode === 'signup' ? (
          <Signup onSignup={handleSignup} switchToLogin={switchToLogin} apiBaseUrl={API_BASE_URL} />
        ) : (
          <Login onLogin={handleLogin} switchToSignup={switchToSignup} apiBaseUrl={API_BASE_URL} />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        
        <ContactForm onContactAdded={handleContactAdded} apiBaseUrl={API_BASE_URL} />
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="no-contacts-container">
            <img 
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png" 
              alt="No contacts" 
              className="no-data-img"
            />
            <h3>No Contacts Found</h3>
            <p>Add some contacts to get started!</p>
          </div>
        ) : (
          <>
            <ContactList 
              contacts={contacts} 
              onDeleteContact={handleDeleteContact}
              isLoading={isLoading}
              apiBaseUrl={API_BASE_URL}
            />
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;