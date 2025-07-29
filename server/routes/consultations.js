const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

// Add this line for debugging
console.log('Consultations route file loaded');

// Add this test route at the top of the file
router.get('/test', (req, res) => {
  res.json({ message: 'Consultation route is working' });
});

// Simplified POST route for testing
router.post('/', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    
    // Create consultation without validation first
    const consultation = new Consultation({
      patientName: req.body.patientName,
      age: req.body.age,
      phone: req.body.phone,
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime,
      description: req.body.description || '',
      department: req.body.department,
      hospitalId: req.body.hospitalId,
      hospitalName: req.body.hospitalName,
      status: 'pending'
    });

    console.log('Created consultation object:', consultation);
    
    const saved = await consultation.save();
    console.log('Saved consultation:', saved);

    res.status(201).json({
      message: 'Consultation booked successfully',
      consultation: saved
    });
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      message: 'Failed to book consultation',
      error: error.message
    });
  }
});

module.exports = router; 