const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Pharmacy', 'Blood Bank']
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  timing: {
    type: String,
    required: true
  },
  discounts: {
    type: String,
    default: ''
  },
  features: {
    type: [String],
    default: []
  },
  stockAvailability: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pharmacy', pharmacySchema); 