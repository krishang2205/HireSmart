const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.Mixed, required: true, index: true, unique: true },
  jobDescription: { type: String, required: true },
  jobRole: { type: String, default: '' },
  experienceLevel: { 
    type: String, 
    enum: ['Fresher', 'Junior', 'Mid-level', 'Senior', 'Expert'],
    default: 'Junior'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Job', jobSchema);


