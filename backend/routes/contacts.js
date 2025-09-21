// backend/routes/contacts.js
const express = require('express');
const router = express.Router();
const contactManager = require('../models/Contact');

// User routes
router.post('/signup', (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = contactManager.signUp(username, email, password);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = contactManager.login(email, password);
    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  contactManager.logout();
  res.json({ message: 'Logout successful' });
});

router.get('/user', (req, res) => {
  try {
    const user = contactManager.getCurrentUser();
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact routes
router.get('/contacts', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = contactManager.getAllContacts(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/contacts', (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = contactManager.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    contactManager.deleteContact(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;