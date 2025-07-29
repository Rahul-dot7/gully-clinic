const mongoose = require('mongoose');

const specialistDoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  speciality: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  fee: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  },
  qualifications: {
    type: [String],
    default: []
  },
  languages: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SpecialistDoctor', specialistDoctorSchema); 