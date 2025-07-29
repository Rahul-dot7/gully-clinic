const mongoose = require('mongoose');
const SpecialistDoctor = require('../models/SpecialistDoctor');
require('dotenv').config();

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    speciality: "Pediatrician",
    experience: "15 years",
    location: "Mumbai Central",
    fee: "₹1000",
    qualifications: ["MBBS", "MD Pediatrics"],
    languages: ["English", "Hindi", "Marathi"]
  },
  {
    name: "Dr. Amit Patel",
    speciality: "Pediatrician",
    experience: "12 years",
    location: "Andheri West",
    fee: "₹1200",
    qualifications: ["MBBS", "DNB Pediatrics"],
    languages: ["English", "Hindi", "Gujarati"]
  },
  {
    name: "Dr. Michael Chen",
    speciality: "Cardiologist",
    experience: "20 years",
    location: "Bandra",
    fee: "₹1500",
    qualifications: ["MBBS", "MD Cardiology", "DM"],
    languages: ["English", "Hindi"]
  },
  {
    name: "Dr. Priya Sharma",
    speciality: "Neurologist",
    experience: "10 years",
    location: "Powai",
    fee: "₹1300",
    qualifications: ["MBBS", "MD Neurology"],
    languages: ["English", "Hindi", "Bengali"]
  }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await SpecialistDoctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert new doctors
    const result = await SpecialistDoctor.insertMany(doctors);
    console.log(`Added ${result.length} doctors`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
};

seedDoctors(); 