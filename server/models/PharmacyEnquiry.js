const mongoose = require('mongoose');

const pharmacyEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  medicine: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  message: String,
  pharmacyId: {
    type: String,
    required: true
  },
  pharmacyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PharmacyEnquiry', pharmacyEnquirySchema); 