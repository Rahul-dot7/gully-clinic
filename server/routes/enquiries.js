const express = require('express');
const router = express.Router();
const PharmacyEnquiry = require('../models/PharmacyEnquiry');

console.log('Loading enquiries route...');

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Enquiries route is working' });
});

// Submit an enquiry
router.post('/', async (req, res) => {
  console.log('POST request received at /api/enquiries');
  console.log('Request body:', req.body);
  
  try {
    const enquiry = new PharmacyEnquiry(req.body);
    console.log('Created enquiry object:', enquiry);
    
    await enquiry.save();
    console.log('Saved enquiry to database');
    
    res.status(201).json({ 
      message: 'Enquiry submitted successfully',
      enquiry 
    });
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      message: 'Failed to submit enquiry',
      error: error.message 
    });
  }
});

// Get all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await PharmacyEnquiry.find();
    res.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ message: 'Error fetching enquiries' });
  }
});

module.exports = router; 