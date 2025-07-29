const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

router.post('/consultation', async (req, res) => {
  try {
    const consultation = new Appointment({
      ...req.body,
      type: 'consultation',
      status: 'pending'
    });
    await consultation.save();
    res.status(201).json({ message: 'Consultation booked successfully' });
  } catch (error) {
    console.error('Error booking consultation:', error);
    res.status(500).json({ message: 'Error booking consultation' });
  }
});

module.exports = router; 