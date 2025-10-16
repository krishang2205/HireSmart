const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  resumeScore: { type: Number, required: true },
  category: { type: String, enum: ['Best Match', 'Can consider for interview', 'Not Good Candidate', 'Consider with Caution'], required: true },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String }
  },
  status: { type: String, enum: ['Pending', 'Communication Sent', 'Assessment Assigned', 'Assessment Completed'], default: 'Pending' },
  assessmentScore: { type: Number, default: null },
  finalRank: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
