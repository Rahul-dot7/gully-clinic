const express = require('express');
const router = express.Router();
const SpecialistBooking = require('../models/SpecialistBooking');
const SpecialistDoctor = require('../models/SpecialistDoctor');

console.log('Specialist route loaded');

router.get('/test', (req, res) => {
  res.json({ message: 'Specialist route is working' });
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await SpecialistDoctor.find();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Add a new doctor
router.post('/doctors', async (req, res) => {
  try {
    const doctor = new SpecialistDoctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Error adding doctor' });
  }
});

router.post('/book', async (req, res) => {
  try {
    console.log('Received specialist booking data:', req.body);
    
    const booking = new SpecialistBooking({
      patientName: req.body.patientName,
      age: req.body.age,
      phone: req.body.phone,
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime,
      description: req.body.description || '',
      speciality: req.body.speciality,
      doctorId: req.body.doctorId,
      doctorName: req.body.doctorName,
      status: 'pending'
    });

    console.log('Created booking object:', booking);
    
    const saved = await booking.save();
    console.log('Saved booking:', saved);

    res.status(201).json({
      message: 'Specialist appointment booked successfully',
      booking: saved
    });
  } catch (error) {
    console.error('Booking error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      message: 'Failed to book appointment',
      error: error.message
    });
  }
});

module.exports = router; 