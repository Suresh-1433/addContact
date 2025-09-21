// backend/models/Contact.js
class Contact {
  constructor(id, name, email, phone, userId) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.userId = userId;
  }
}

class User {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class ContactManager {
  constructor() {
    this.contacts = [];
    this.users = [];
    this.nextId = 1;
    this.nextUserId = 1;
    this.currentUser = null;
  }

  // User management methods
  signUp(username, email, password) {
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    if (this.users.find(user => user.email === email)) {
      throw new Error('User already exists with this email');
    }

    const newUser = new User(this.nextUserId++, username, email, password);
    this.users.push(newUser);
    return newUser;
  }

  login(email, password) {
    const user = this.users.find(user => user.email === email && user.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    this.currentUser = user;
    return user;
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Contact management methods
  getAllContacts(page = 1, limit = 10) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const userContacts = this.contacts.filter(contact => contact.userId === this.currentUser.id);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = userContacts.slice(startIndex, endIndex);
    
    return {
      contacts: paginatedContacts,
      total: userContacts.length,
      page,
      totalPages: Math.ceil(userContacts.length / limit)
    };
  }

  addContact(name, email, phone) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    // Validate input
    if (!name || !email || !phone) {
      throw new Error('All fields are required');
    }
    
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (!this.isValidPhone(phone)) {
      throw new Error('Phone must be 10 digits');
    }
    
    const newContact = new Contact(this.nextId++, name, email, phone, this.currentUser.id);
    this.contacts.push(newContact);
    return newContact;
  }

  deleteContact(id) {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const index = this.contacts.findIndex(contact => 
      contact.id === parseInt(id) && contact.userId === this.currentUser.id
    );
    
    if (index === -1) {
      throw new Error('Contact not found');
    }
    this.contacts.splice(index, 1);
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }
}

// Create a singleton instance
const contactManager = new ContactManager();

// Add some sample users and contacts for testing
const user1 = contactManager.signUp('john_doe', 'john@example.com', 'password123');
contactManager.login('john@example.com', 'password123');
contactManager.addContact('John Doe', 'john@example.com', '1234567890');
contactManager.addContact('Jane Smith', 'jane@example.com', '0987654321');
contactManager.logout();

module.exports = contactManager;