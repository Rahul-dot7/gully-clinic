const express = require('express');
const router = express.Router();
const FamilyMember = require('../models/FamilyMember');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Add family members
router.post('/add', auth, async (req, res) => {
    try {
        const { familyMembers } = req.body;
        
        if (!Array.isArray(familyMembers) || familyMembers.length === 0) {
            return res.status(400).json({ message: 'Family members data is required' });
        }

        const savedMembers = [];
        const errors = [];

        for (const member of familyMembers) {
            try {
                // Check if user exists
                const user = await User.findById(req.user.id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Check for duplicate Aadhaar number
                const existingMember = await FamilyMember.findOne({ 
                    aadhaarNumber: member.aadhaarNumber 
                });
                
                if (existingMember) {
                    errors.push(`Aadhaar number ${member.aadhaarNumber} is already registered`);
                    continue;
                }

                // Create new family member
                const newMember = new FamilyMember({
                    userId: req.user.id,
                    name: member.name,
                    relationship: member.relationship,
                    aadhaarNumber: member.aadhaarNumber,
                    bloodGroup: member.bloodGroup,
                    allergies: member.allergies || [],
                    conditions: member.conditions || []
                });

                const savedMember = await newMember.save();
                savedMembers.push(savedMember);
            } catch (error) {
                errors.push(`Error saving member ${member.name}: ${error.message}`);
            }
        }

        if (savedMembers.length === 0 && errors.length > 0) {
            return res.status(400).json({ 
                message: 'Failed to save any family members',
                errors 
            });
        }

        res.status(201).json({
            message: 'Family members added successfully',
            savedMembers,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Error adding family members:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get family members for a user
router.get('/', auth, async (req, res) => {
    try {
        const familyMembers = await FamilyMember.find({ userId: req.user.id });
        res.json(familyMembers);
    } catch (error) {
        console.error('Error fetching family members:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a family member
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, relationship, bloodGroup, allergies, conditions } = req.body;
        
        const familyMember = await FamilyMember.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!familyMember) {
            return res.status(404).json({ message: 'Family member not found' });
        }

        familyMember.name = name || familyMember.name;
        familyMember.relationship = relationship || familyMember.relationship;
        familyMember.bloodGroup = bloodGroup || familyMember.bloodGroup;
        familyMember.allergies = allergies || familyMember.allergies;
        familyMember.conditions = conditions || familyMember.conditions;

        await familyMember.save();
        res.json(familyMember);
    } catch (error) {
        console.error('Error updating family member:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a family member
router.delete('/:id', auth, async (req, res) => {
    try {
        const familyMember = await FamilyMember.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!familyMember) {
            return res.status(404).json({ message: 'Family member not found' });
        }

        res.json({ message: 'Family member deleted successfully' });
    } catch (error) {
        console.error('Error deleting family member:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete all family members for a user
router.delete('/delete-all', auth, async (req, res) => {
    try {
        await FamilyMember.deleteMany({ userId: req.user.id });
        res.json({ message: 'All family members deleted successfully' });
    } catch (error) {
        console.error('Error deleting family members:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 