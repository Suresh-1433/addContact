// frontend/src/components/Header.js
import React from 'react';
import './Header.css';

const Header = ({ user, onLogout, apiBaseUrl }) => {
  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/logout`, {
        method: 'POST',
      });
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Contact Book</h1>
        {user && (
          <div className="user-section">
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;