const Assessment = require('../models/Assessment');
const Job = require('../models/Job');

// Create a new assessment
async function createAssessment(assessmentData) {
  try {
    console.log('createAssessment: Received data:', JSON.stringify(assessmentData, null, 2));
    
    // Calculate total questions per test
    const totalQuestions = assessmentData.aptitudeQuestions + assessmentData.jobRoleQuestions + assessmentData.codingQuestions;
    console.log('createAssessment: Calculated totalQuestions:', totalQuestions);
    
    const assessment = new Assessment({
      ...assessmentData,
      totalQuestions
    });
    console.log('createAssessment: Created assessment object:', assessment);
    
    const savedAssessment = await assessment.save();
    console.log('createAssessment: Successfully saved assessment:', savedAssessment);
    return savedAssessment;
  } catch (error) {
    console.error('createAssessment: Error details:', error);
    console.error('createAssessment: Error message:', error.message);
    console.error('createAssessment: Error stack:', error.stack);
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
    console.log('assessmentController: Fetching job roles from jobs collection...');
    
    // Get all jobs with their jobRole, jobDescription, and experienceLevel
    const allJobs = await Job.find({}, 'jobRole jobDescription originalJobId experienceLevel');
    console.log('assessmentController: Found all jobs:', allJobs);
    
    // Group by jobRole to get unique roles with their descriptions
    const uniqueJobRoles = [];
    const roleMap = new Map();
    
    allJobs.forEach(job => {
      if (job.jobRole && job.jobRole !== 'Unknown Role') {
        if (!roleMap.has(job.jobRole)) {
          roleMap.set(job.jobRole, {
            _id: job._id,
            jobRole: job.jobRole,
            jobDescription: job.jobDescription,
            originalJobId: job.originalJobId,
            experienceLevel: job.experienceLevel
          });
        }
      }
    });
    
    const result = Array.from(roleMap.values());
    console.log('assessmentController: Unique job roles extracted:', result);
    console.log('assessmentController: Job roles count:', result.length);
    
    return result;
  } catch (error) {
    console.error('assessmentController: Error fetching job roles:', error);
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
