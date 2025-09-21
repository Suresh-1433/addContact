// backend/routes/contacts.js
const express = require('express');
const router = express.Router();
const contactManager = require('../models/Contact');

// GET all contacts with pagination
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = contactManager.getAllContacts(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new contact
router.post('/', (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = contactManager.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a contact
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    contactManager.deleteContact(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;