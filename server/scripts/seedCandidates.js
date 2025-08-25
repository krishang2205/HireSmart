const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');

// Sample candidates for seeding
const candidates = [
  {
    name: 'Amit Sharma',
    resumeScore: 85,
    category: 'Best one',
    contactInfo: { email: 'amit.sharma@example.com', phone: '9876543210' },
    status: 'Pending',
    assessmentScore: null,
    finalRank: null
  },
  {
    name: 'Priya Singh',
    resumeScore: 72,
    category: 'Can consider',
    contactInfo: { email: 'priya.singh@example.com', phone: '9123456780' },
    status: 'Pending',
    assessmentScore: null,
    finalRank: null
  },
  {
    name: 'Rahul Verma',
    resumeScore: 60,
    category: 'Not hire',
    contactInfo: { email: 'rahul.verma@example.com', phone: '9988776655' },
    status: 'Pending',
    assessmentScore: null,
    finalRank: null
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiresmart');
  await Candidate.deleteMany({});
  await Candidate.insertMany(candidates);
  console.log('Sample candidates seeded');
  process.exit();
}

seed();
