const mongoose = require('mongoose');
const Pharmacy = require('../models/Pharmacy');
require('dotenv').config();

const pharmacies = [
  {
    name: "LifeCare Pharmacy",
    type: "Pharmacy",
    address: "123 Health Street, Mumbai Central",
    phone: "+91 98765 43210",
    timing: "24/7",
    discounts: "10% off on generic medicines",
    features: [
      "Home delivery available",
      "Generic medicines available",
      "Online prescriptions accepted"
    ],
    stockAvailability: true
  },
  {
    name: "City Blood Bank",
    type: "Blood Bank",
    address: "456 Medical Avenue, Andheri West",
    phone: "+91 98765 43211",
    timing: "8:00 AM - 8:00 PM",
    features: [
      "All blood groups available",
      "Component separation facility",
      "Emergency services"
    ],
    stockAvailability: true
  },
  {
    name: "MediPlus Pharmacy",
    type: "Pharmacy",
    address: "789 Health Lane, Bandra",
    phone: "+91 98765 43212",
    timing: "8:00 AM - 11:00 PM",
    discounts: "15% off for senior citizens",
    features: [
      "Wide range of medicines",
      "Healthcare products",
      "Monthly medicine subscriptions"
    ],
    stockAvailability: true
  }
];

const seedPharmacies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing pharmacies
    await Pharmacy.deleteMany({});
    console.log('Cleared existing pharmacies');

    // Insert new pharmacies
    const result = await Pharmacy.insertMany(pharmacies);
    console.log(`Added ${result.length} pharmacies`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding pharmacies:', error);
    process.exit(1);
  }
};

seedPharmacies(); 