const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{4}-\d{4}-\d{4}$/, 'Please enter a valid Aadhaar number in format: XXXX-XXXX-XXXX']
  },
  bloodGroup: {
    type: String,
    required: true
  },
  allergies: [{
    type: String
  }],
  conditions: [{
    type: String
  }],
  relation: {
    type: String,
    required: true,
    enum: ['Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Other']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'healthcare-access.familyMembers' });

module.exports = mongoose.model('FamilyMember', familyMemberSchema); 