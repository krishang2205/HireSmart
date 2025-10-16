const mongoose = require('mongoose');

const matchResultSchema = new mongoose.Schema({
  jobId: { type: String, required: false },
  originalJobId: { type: String }, // To reference the original job post if needed
  candidateId: { type: String, required: false }, // ID from resume parser or generated
  filename: { type: String, required: true },
  candidateName: { type: String, default: 'Unknown' },
  email: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  prediction: { type: String, default: 'Pending' },
  matchScore: { type: Number, default: 0 },
  matched_skills: { type: [String], default: [] },
  explanation: { type: String, default: '' },
  jobRole: { type: String, default: '' },
  status: { type: String, default: 'Pending Communication' },

  // Assessment fields
  assessmentScore: { type: Number },
  assessmentDetails: { type: mongoose.Schema.Types.Mixed }, // Store full JSON breakdown (sections, questions, etc.)
  assessmentCompletedAt: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MatchResult', matchResultSchema);
