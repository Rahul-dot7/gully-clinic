const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const LoginHistory = require('../models/LoginHistory');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', JSON.stringify(req.body, null, 2));
    
    const {
      email,
      password,
      name,
      aadhaarNumber,
      bloodGroup,
      allergies,
      conditions,
      location,
      familyMembers
    } = req.body;

    // Detailed validation checks
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!name) missingFields.push('name');
    if (!aadhaarNumber) missingFields.push('aadhaarNumber');
    if (!bloodGroup) missingFields.push('bloodGroup');
    if (!location) missingFields.push('location');

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate Aadhaar format
    const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
    if (!aadhaarRegex.test(aadhaarNumber)) {
      console.log('Invalid Aadhaar format:', aadhaarNumber);
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar number format. Required format: XXXX-XXXX-XXXX'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { aadhaarNumber }
      ]
    });
    
    if (existingUser) {
      const duplicateField = existingUser.email === email ? 'email' : 'Aadhaar number';
      console.log(`User already exists with ${duplicateField}:`, duplicateField === 'email' ? email : aadhaarNumber);
      return res.status(400).json({
        success: false,
        message: `User with this ${duplicateField} already exists`
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      aadhaarNumber,
      bloodGroup,
      location,
      allergies: allergies || [],
      conditions: conditions || []
    });

    // Save the user
    await user.save();
    console.log('Main user created successfully:', user.email, 'with user number:', user.userNumber);

    // Process family members if any
    let savedFamilyMembers = [];
    if (familyMembers && familyMembers.length > 0) {
      console.log('Processing family members:', familyMembers.length);
      
      // Validate family members
      for (const member of familyMembers) {
        if (!member.name || !member.relation || !member.aadhaarNumber || !member.bloodGroup) {
          return res.status(400).json({
            success: false,
            message: 'Invalid family member data. All fields are required.'
          });
        }
        
        if (!aadhaarRegex.test(member.aadhaarNumber)) {
          return res.status(400).json({
            success: false,
            message: `Invalid Aadhaar number format for family member ${member.name}`
          });
        }
      }

      // Prepare family member documents
      const familyMemberDocs = familyMembers.map(member => ({
        ...member,
        userId: user._id,
        allergies: member.allergies || [],
        conditions: member.conditions || []
      }));

      // Use insertMany to store all family members at once
      savedFamilyMembers = await FamilyMember.insertMany(familyMemberDocs);
      console.log('Family members saved successfully:', savedFamilyMembers.length);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Log successful registration
    await new LoginHistory({
      userId: user._id,
      email: user.email,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }).save();
    console.log('Registration login history created');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        aadhaarNumber: user.aadhaarNumber,
        bloodGroup: user.bloodGroup,
        location: user.location,
        userNumber: user.userNumber,
        allergies: user.allergies,
        conditions: user.conditions,
        familyMembers: savedFamilyMembers.map(member => ({
          id: member._id,
          name: member.name,
          relation: member.relation,
          aadhaarNumber: member.aadhaarNumber,
          bloodGroup: member.bloodGroup,
          allergies: member.allergies,
          conditions: member.conditions
        }))
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log(`Duplicate key error for field: ${field}`);
      return res.status(400).json({
        success: false,
        message: `A user with this ${field} already exists`
      });
    }
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      console.error('MongoDB error:', error);
      return res.status(500).json({
        success: false,
        message: 'Database connection error. Please try again later.'
      });
    }
    
    // Log the full error for debugging
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    
    // Log attempt
    const loginAttempt = {
      email,
      status: 'failed',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };

    if (!user) {
      // For failed logins where user doesn't exist, we can't create a LoginHistory entry
      // because userId is required. Instead, just log the attempt to console
      console.log('Failed login attempt - User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Now we have the user, so we can include userId in the login history
      loginAttempt.userId = user._id;
      await new LoginHistory(loginAttempt).save();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Get family members
    const familyMembers = await FamilyMember.find({ userId: user._id });

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Log successful login
    await new LoginHistory({
      userId: user._id,
      email: user.email,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }).save();

    // Send response with complete user data
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userNumber: user.userNumber,
        aadhaarNumber: user.aadhaarNumber,
        bloodGroup: user.bloodGroup,
        location: user.location,
        allergies: user.allergies || [],
        conditions: user.conditions || [],
        familyMembers: familyMembers.map(member => ({
          id: member._id,
          name: member.name,
          relation: member.relation,
          aadhaarNumber: member.aadhaarNumber,
          bloodGroup: member.bloodGroup,
          allergies: member.allergies || [],
          conditions: member.conditions || []
        }))
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, aadhaarNumber, bloodGroup, allergies, conditions, familyMembers } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email or Aadhaar is being changed and if it already exists
    if (email !== user.email || aadhaarNumber !== user.aadhaarNumber) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: id } },
          {
            $or: [
              { email },
              { aadhaarNumber }
            ]
          }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email or Aadhaar number already exists'
        });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (aadhaarNumber) user.aadhaarNumber = aadhaarNumber;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (allergies) user.allergies = allergies;
    if (conditions) user.conditions = conditions;

    await user.save();
    console.log('User updated successfully:', user.email);

    // Update family members if provided
    let updatedFamilyMembers = [];
    if (familyMembers) {
      // First, remove existing family members
      await FamilyMember.deleteMany({ userId: user._id });
      console.log('Existing family members removed');

      // Then add new family members
      if (familyMembers.length > 0) {
        const familyMemberDocs = familyMembers.map(member => ({
          ...member,
          userId: user._id,
          allergies: member.allergies || [],
          conditions: member.conditions || []
        }));
        updatedFamilyMembers = await FamilyMember.insertMany(familyMemberDocs);
        console.log('New family members saved:', updatedFamilyMembers.length);
      }
    } else {
      // If no new family members provided, get existing ones
      updatedFamilyMembers = await FamilyMember.find({ userId: user._id });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userNumber: user.userNumber,
        aadhaarNumber: user.aadhaarNumber,
        bloodGroup: user.bloodGroup,
        location: user.location,
        allergies: user.allergies,
        conditions: user.conditions,
        familyMembers: updatedFamilyMembers.map(member => ({
          id: member._id,
          name: member.name,
          relation: member.relation,
          aadhaarNumber: member.aadhaarNumber,
          bloodGroup: member.bloodGroup,
          allergies: member.allergies,
          conditions: member.conditions
        }))
      }
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
}; 