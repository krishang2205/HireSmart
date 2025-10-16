const Assessment = require('../models/Assessment');
const Job = require('../models/Job');
const MatchResult = require('../models/MatchResult');
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

    // Find all candidates from MatchResult collection
    const candidates = await MatchResult.find({ _id: { $in: candidateIds } });

    console.log('sendAssessmentToCandidates: Looking for candidates with IDs:', candidateIds);
    console.log('sendAssessmentToCandidates: Found candidates:', candidates);

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
          candidate.email,
          candidate.candidateName,
          assessmentLink,
          jobRole || 'Technical Assessment',
          companyName || 'HireSmart'
        );

        // Update candidate status
        candidate.status = 'Assessment Sent';
        await candidate.save();

        results.push({
          candidateId: candidate._id,
          candidateName: candidate.candidateName,
          email: candidate.email,
          status: 'sent',
          success: true
        });

        successCount++;
        console.log(`sendAssessmentToCandidates: Successfully sent assessment to ${candidate.candidateName} (${candidate.email})`);

      } catch (error) {
        console.error(`sendAssessmentToCandidates: Failed to send assessment to ${candidate.candidateName}:`, error);

        results.push({
          candidateId: candidate._id,
          candidateName: candidate.candidateName,
          email: candidate.email,
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

// Submit external assessment results
async function submitAssessmentResults(data) {
  try {
    // Handle both old structure (email, score) and new structure (candidateEmail, totalScore/overallPercentage)
    const email = data.candidateEmail || data.email;
    const score = data.overallPercentage !== undefined ? data.overallPercentage : (data.totalScore !== undefined ? data.totalScore : data.score);
    const sections = data.sections;
    const candidateId = data.candidateId;

    console.log('submitAssessmentResults: Received data:', JSON.stringify(data, null, 2));

    if (!email && !candidateId) {
      throw new Error('Candidate email or ID is required');
    }

    // Find candidate by email or ID in MatchResult. 
    // Prioritize ID if valid, otherwise check email.
    // User requested "matching candidate email and name".
    // We will search by email first. If name is provided, we can verify or use it for fuzzy matching if needed.
    // For now, strict email match is safer. If needed, we can add { email: email, candidateName: { $regex: new RegExp(name, 'i') } }

    let query;
    if (candidateId) {
      query = { _id: candidateId };
    } else {
      query = { email: email };
      // If getting multiple results (e.g. same candidate applied multiple times), we might want to filter by name or jobRole.
      // But findOne gets the first one. Let's assume email is unique enough for now or the first match is acceptable.
    }

    let candidate = await MatchResult.findOne(query);

    if (!candidate) {
      console.log(`submitAssessmentResults: Candidate not found with query ${JSON.stringify(query)}`);
      // If candidate not found by email, try fuzzy name match + email if strictly required?
      // Or maybe the user meant "save to db" as "create new record if not found"? 
      // Usually we only update existing candidates.
      throw new Error(`Candidate not found with email: ${email}`);
    }

    console.log(`submitAssessmentResults: Found candidate: ${candidate.candidateName}`);

    // Update candidate with assessment results
    candidate.assessmentScore = score;
    // Store the entire data object as details to preserve full context (sections, questions, timeTaken, etc.)
    candidate.assessmentDetails = data;
    candidate.status = 'Assessment Completed';
    candidate.assessmentCompletedAt = new Date();

    await candidate.save();

    console.log(`submitAssessmentResults: Successfully updated candidate ${candidate.candidateName}`);

    return {
      success: true,
      message: 'Assessment results submitted successfully',
      candidate: {
        id: candidate._id,
        name: candidate.candidateName,
        status: candidate.status
      }
    };

  } catch (error) {
    console.error('submitAssessmentResults: Error details:', error);
    throw new Error(`Failed to submit assessment results: ${error.message}`);
  }
}

module.exports = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAvailableJobRoles,
  sendAssessmentToCandidates,
  submitAssessmentResults
};
