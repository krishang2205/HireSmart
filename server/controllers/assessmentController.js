const Assessment = require('../models/Assessment');
const Job = require('../models/Job');

// Create a new assessment
async function createAssessment(assessmentData) {
  try {
    const assessment = new Assessment(assessmentData);
    const savedAssessment = await assessment.save();
    return savedAssessment;
  } catch (error) {
    throw new Error(`Failed to create assessment: ${error.message}`);
  }
}

// Get all assessments
async function getAllAssessments() {
  try {
    const assessments = await Assessment.find({}).sort({ createdAt: -1 });
    return assessments;
  } catch (error) {
    throw new Error(`Failed to fetch assessments: ${error.message}`);
  }
}

// Get assessment by ID
async function getAssessmentById(assessmentId) {
  try {
    const assessment = await Assessment.findById(assessmentId);
    return assessment;
  } catch (error) {
    throw new Error(`Failed to fetch assessment: ${error.message}`);
  }
}

// Update assessment
async function updateAssessment(assessmentId, updateData) {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      updateData,
      { new: true, runValidators: true }
    );
    return assessment;
  } catch (error) {
    throw new Error(`Failed to update assessment: ${error.message}`);
  }
}

// Delete assessment
async function deleteAssessment(assessmentId) {
  try {
    const result = await Assessment.findByIdAndDelete(assessmentId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete assessment: ${error.message}`);
  }
}

// Get all unique job roles from jobs collection
async function getAvailableJobRoles() {
  try {
    const jobs = await Job.find({}, 'jobRole jobDescription');
    return jobs;
  } catch (error) {
    throw new Error(`Failed to fetch job roles: ${error.message}`);
  }
}

module.exports = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAvailableJobRoles
};
