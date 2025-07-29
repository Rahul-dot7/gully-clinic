const express = require('express');
const router = express.Router();
const PhysiotherapyBooking = require('../models/PhysiotherapyBooking');

router.post('/bookings', async (req, res) => {
  try {
    const booking = new PhysiotherapyBooking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Physiotherapy session booked successfully' });
  } catch (error) {
    console.error('Error booking physiotherapy session:', error);
    res.status(500).json({ message: 'Error booking physiotherapy session' });
  }
});

module.exports = router; 