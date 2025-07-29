const mongoose = require('mongoose');

const specialistBookingSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required']
  },
  age: {
    type: String,
    required: [true, 'Age is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required']
  },
  description: String,
  speciality: {
    type: String,
    required: [true, 'Speciality is required']
  },
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required']
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SpecialistBooking', specialistBookingSchema); 