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
    relationship: {
        type: String,
        required: true
    },
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema); 