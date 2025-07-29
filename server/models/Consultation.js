const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
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
  department: {
    type: String,
    required: [true, 'Department/Specialty is required']
  },
  hospitalId: {
    type: String,
    required: [true, 'Hospital ID is required']
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required']
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

module.exports = mongoose.model('Consultation', consultationSchema); 