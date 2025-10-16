const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  jobRole: { type: String, required: true },
  jobDescription: { type: String, required: true },
  experienceLevel: { 
    type: String, 
    enum: ['Fresher', 'Junior', 'Mid-level', 'Senior', 'Expert'], 
    required: true 
  },
  aptitudeQuestions: { type: Number, required: true, default: 0 },
  jobRoleQuestions: { type: Number, required: true, default: 0 },
  codingQuestions: { type: Number, required: true, default: 0 },
  totalQuestions: { type: Number, required: true }, // total questions per test
  testDuration: { type: Number, required: true }, // in minutes
  selectedCandidates: { type: Number, required: true }, // number of candidates selected
  candidateIds: [{ type: String }], // array of candidate IDs
  status: { 
    type: String, 
    enum: ['Draft', 'Active', 'Completed'], 
    default: 'Draft' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

assessmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
