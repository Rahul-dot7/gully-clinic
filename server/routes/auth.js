const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const LoginHistory = require('../models/LoginHistory');
const { register, login, updateUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Protected routes
router.put('/update/:id', auth, updateUser);

// Add family members route
router.post('/add-family-members', async (req, res) => {
  try {
    console.log('Adding family members:', JSON.stringify(req.body, null, 2));
    const { userId, familyMembers } = req.body;

    if (!userId || !familyMembers || !Array.isArray(familyMembers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request format. userId and familyMembers array required.'
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const savedFamilyMembers = [];
    for (const member of familyMembers) {
      // Validate required fields
      const requiredFields = ['name', 'relation', 'aadhaarNumber', 'bloodGroup'];
      const missingFields = requiredFields.filter(field => !member[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields for family member: ${missingFields.join(', ')}`
        });
      }

      // Check if family member with same Aadhaar exists
      const existingMember = await FamilyMember.findOne({ aadhaarNumber: member.aadhaarNumber });
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: `Family member with Aadhaar number ${member.aadhaarNumber} already exists`
        });
      }

      // Create new family member
      const familyMember = new FamilyMember({
        userId,
        name: member.name,
        relation: member.relation,
        aadhaarNumber: member.aadhaarNumber,
        bloodGroup: member.bloodGroup,
        allergies: member.allergies || [],
        conditions: member.conditions || []
      });

      const savedMember = await familyMember.save();
      console.log('Family member created successfully:', savedMember.name);
      savedFamilyMembers.push(savedMember);
    }

    res.status(201).json({
      success: true,
      message: 'Family members added successfully',
      familyMembers: savedFamilyMembers.map(member => ({
        id: member._id,
        name: member.name,
        relation: member.relation,
        aadhaarNumber: member.aadhaarNumber,
        bloodGroup: member.bloodGroup,
        allergies: member.allergies,
        conditions: member.conditions
      }))
    });

  } catch (error) {
    console.error('Error adding family members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add family members',
      error: error.message
    });
  }
});

module.exports = router; 