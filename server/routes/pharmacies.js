const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');

// Get all pharmacies
router.get('/', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json({ message: 'Error fetching pharmacies' });
  }
});

// Add a new pharmacy
router.post('/', async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.status(201).json({ message: 'Pharmacy added successfully', pharmacy });
  } catch (error) {
    console.error('Error adding pharmacy:', error);
    res.status(500).json({ message: 'Error adding pharmacy' });
  }
});

module.exports = router;