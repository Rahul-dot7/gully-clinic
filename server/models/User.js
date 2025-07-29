const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    unique: true,
    trim: true,
    match: [/^\d{4}-\d{4}-\d{4}$/, 'Please enter a valid Aadhaar number in format: XXXX-XXXX-XXXX']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    trim: true,
    uppercase: true
  },
  userNumber: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
  allergies: [{
    type: String,
    trim: true
  }],
  conditions: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate user number before saving if not already set
userSchema.pre('save', async function(next) {
  // Only generate userNumber if it's a new user or userNumber is not set
  if (this.isNew && !this.userNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Get location prefix - handle different formats
    let locationPrefix;
    if (this.location) {
      // If location is already a short code (e.g., "JOG")
      if (this.location.length <= 3) {
        locationPrefix = this.location.toUpperCase();
      } else {
        // If location is a full name (e.g., "JOGESHWARI")
        locationPrefix = this.location.slice(0, 3).toUpperCase();
      }
    } else {
      // Default if location is somehow missing
      locationPrefix = 'USR';
    }
    
    // Format: LOCATION-YYMMDD-XXX (e.g., JOG-230901-001)
    this.userNumber = `${locationPrefix}-${year}${month}${day}-${random}`;
    console.log('Auto-generated userNumber:', this.userNumber);
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Specify the collection name as 'registeredUsers'
module.exports = mongoose.model('User', userSchema, 'registeredUsers'); 