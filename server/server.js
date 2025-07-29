const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const physiotherapyRoutes = require('./routes/physiotherapy');
const consultationRoutes = require('./routes/consultations');
const specialistRoutes = require('./routes/specialist');
const pharmacyRoutes = require('./routes/pharmacies');
const enquiryRoutes = require('./routes/enquiries');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  console.log('======================');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Handle MongoDB connection errors after initial connection
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
  });
  
  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if we can't connect to the database
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/physiotherapy', physiotherapyRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/specialist', specialistRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Debug 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: [
      'POST /api/consultations',
      'POST /api/appointments',
      'POST /api/physiotherapy',
      'POST /api/enquiries'
    ]
  });
});

// Add this right after your routes
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/consultations');
  console.log('- POST /api/appointments');
  console.log('- POST /api/physiotherapy');
  console.log('- POST /api/enquiries');
});