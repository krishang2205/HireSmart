const Assessment = require('../models/Assessment');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const { sendAssessmentEmail } = require('../utils/email');

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

// Send assessment links to selected candidates
async function sendAssessmentToCandidates(data) {
  try {
    const { candidateIds, assessmentLinks, jobRole, companyName } = data;
    
    console.log('sendAssessmentToCandidates: Received data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      throw new Error('Candidate IDs are required and must be a non-empty array');
    }
    
    if (!assessmentLinks || !Array.isArray(assessmentLinks) || assessmentLinks.length === 0) {
      throw new Error('Assessment links are required and must be a non-empty array');
    }
    
    // Find all candidates
    const candidates = await Candidate.find({ _id: { $in: candidateIds } });
    
    if (candidates.length === 0) {
      throw new Error('No candidates found with the provided IDs');
    }
    
    console.log(`sendAssessmentToCandidates: Found ${candidates.length} candidates to send assessment to`);
    
    const results = [];
    let successCount = 0;
    let failureCount = 0;
    
    // Send assessment email to each candidate
    for (const candidate of candidates) {
      try {
        // Send assessment email with the first available link
        const assessmentLink = assessmentLinks[0]; // Use first link for now, could be enhanced to distribute links
        
        await sendAssessmentEmail(
          candidate.contactInfo.email,
          candidate.name,
          assessmentLink,
          jobRole || 'Technical Assessment',
          companyName || 'HireSmart'
        );
        
        // Update candidate status
        candidate.status = 'Assessment Sent';
        await candidate.save();
        
        results.push({
          candidateId: candidate._id,
          candidateName: candidate.name,
          email: candidate.contactInfo.email,
          status: 'sent',
          success: true
        });
        
        successCount++;
        console.log(`sendAssessmentToCandidates: Successfully sent assessment to ${candidate.name} (${candidate.contactInfo.email})`);
        
      } catch (error) {
        console.error(`sendAssessmentToCandidates: Failed to send assessment to ${candidate.name}:`, error);
        
        results.push({
          candidateId: candidate._id,
          candidateName: candidate.name,
          email: candidate.contactInfo.email,
          status: 'failed',
          success: false,
          error: error.message
        });
        
        failureCount++;
      }
    }
    
    console.log(`sendAssessmentToCandidates: Completed - ${successCount} successful, ${failureCount} failed`);
    
    return {
      success: true,
      message: `Assessment sent: ${successCount} successful, ${failureCount} failed`,
      sentCount: successCount,
      failedCount: failureCount,
      totalCandidates: candidates.length,
      results: results
    };
    
  } catch (error) {
    console.error('sendAssessmentToCandidates: Error details:', error);
    throw new Error(`Failed to send assessment to candidates: ${error.message}`);
  }
}

module.exports = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAvailableJobRoles,
  sendAssessmentToCandidates
};
