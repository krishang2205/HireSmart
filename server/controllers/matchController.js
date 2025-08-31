const MatchResult = require('../models/MatchResult');
const Job = require('../models/Job');
const { analyzeResumeWithGemini } = require('../services/geminiService');

// Function to determine experience level based on job role
function determineExperienceLevel(jobRole) {
  const role = jobRole.toLowerCase();
  
  // Entry-level roles (0-1 years)
  if (role.includes('intern') || role.includes('trainee') || role.includes('entry') || 
      role.includes('fresher') || role.includes('graduate') || role.includes('student')) {
    return 'Fresher';
  }
  
  // Junior roles (1-3 years)
  if (role.includes('junior') || role.includes('associate') || role.includes('assistant') ||
      role.includes('level 1') || role.includes('entry level')) {
    return 'Junior';
  }
  
  // Mid-level roles (3-5 years)
  if (role.includes('mid') || role.includes('intermediate') || role.includes('level 2') ||
      role.includes('specialist') || role.includes('analyst')) {
    return 'Mid-level';
  }
  
  // Senior roles (5-8 years)
  if (role.includes('senior') || role.includes('lead') || role.includes('level 3') ||
      role.includes('principal') || role.includes('team lead')) {
    return 'Senior';
  }
  
  // Expert roles (8+ years)
  if (role.includes('expert') || role.includes('architect') || role.includes('director') ||
      role.includes('manager') || role.includes('head') || role.includes('chief') ||
      role.includes('vp') || role.includes('cto') || role.includes('ceo')) {
    return 'Expert';
  }
  
  // Default to Junior if no clear indicators
  return 'Junior';
}
// ...existing code...

// Insert match results for a job
// matchResults: [{ candidateId, matchScore }, ...], jobId: ObjectId or String
async function saveMatchResults(jobId, matchResults, jobDescription) {
  console.log('matchController: saveMatchResults called with jobId:', jobId);
  console.log('matchController: matchResults:', matchResults);
  if (jobDescription) {
    console.log('matchController: upserting job description for jobId:', jobId);
    // Extract jobRole from the first match result if available
    const jobRole = matchResults.length > 0 ? matchResults[0].jobRole || '' : '';
    console.log('matchController: Extracted jobRole:', jobRole);
    console.log('matchController: First match result jobRole:', matchResults[0]?.jobRole);
    console.log('matchController: First match result full object:', matchResults[0]);
    
    // Create a unique identifier combining jobId and jobRole to avoid overwriting
    const uniqueJobIdentifier = `${jobId}_${jobRole}`;
    console.log('matchController: Using unique identifier:', uniqueJobIdentifier);
    
    // Determine experience level based on job role
    const experienceLevel = determineExperienceLevel(jobRole);
    
    const jobData = { 
      jobId: uniqueJobIdentifier, 
      originalJobId: jobId,
      jobDescription, 
      jobRole,
      experienceLevel,
      updatedAt: new Date() 
    };
    console.log('matchController: Saving job data:', jobData);
    
    const savedJob = await Job.findOneAndUpdate(
      { jobId: uniqueJobIdentifier },
      jobData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('matchController: Job saved successfully:', savedJob);
    console.log('matchController: Saved job jobRole:', savedJob.jobRole);
  }
  
  // Prepare documents for bulk insert
  const docs = matchResults.map(r => ({
    jobId,
    candidateId: r.candidateId,
    filename: r.filename,
    candidateName: r.candidateName,
    email: r.email,
    contactNumber: r.contactNumber,
    prediction: r.prediction,
    matchScore: typeof r.cosine_similarity_score === 'number' ? r.cosine_similarity_score : 0,
    matched_skills: Array.isArray(r.matched_skills) ? r.matched_skills : [],
    explanation: r.explanation || '',
    jobRole: r.jobRole || ''
  }));
  
  console.log('matchController: Prepared docs for insert:', docs);
  
  // Insert all results
  const result = await MatchResult.insertMany(docs);
  console.log('matchController: Insert result:', result);
  return result;
};

// Fetch all match results for a specific jobId, sorted by matchScore descending
async function getMatchResultsByJob(jobId) {
  console.log('matchController: getMatchResultsByJob called with jobId:', jobId);
  const results = await MatchResult.find({ jobId }).sort({ matchScore: -1 });
  console.log('matchController: Found results:', results);
  return results;
};



// Gemini-powered match analysis
async function getGeminiMatchResult(resumeText, jobDescription, filename) {
  const geminiResult = await analyzeResumeWithGemini(resumeText, jobDescription, filename);
  // Use the returned object directly, with correct keys
  return {
    filename: geminiResult.filename || filename,
    candidateName: geminiResult.candidateName || '',
    email: geminiResult.email || '',
    contactNumber: geminiResult.contactNumber || '',
    prediction: geminiResult.prediction || "Not Good Candidate",
    cosine_similarity_score: typeof geminiResult.cosine_similarity_score === 'number' ? geminiResult.cosine_similarity_score : 0,
    matched_skills: Array.isArray(geminiResult.matched_skills) ? geminiResult.matched_skills : [],
    explanation: geminiResult.explanation || '',
    jobRole: geminiResult.jobRole || ''
  };
}

// Example: Gemini-powered batch resume analysis
// resumes: [{ text, filename }], jobDescription: string
async function analyzeResumesWithGemini(resumes, jobDescription) {
  const results = [];
  for (const resume of resumes) {
    const result = await getGeminiMatchResult(resume.text, jobDescription, resume.filename);
    results.push(result);
  }
  return results;
}

// Fetch all match results (no jobId filter)
async function getAllMatchResults() {
  console.log('matchController: getAllMatchResults called');
  const results = await MatchResult.find({}).sort({ matchScore: -1 });
  console.log('matchController: All results found:', results);
  return results;
};

module.exports = {
  getGeminiMatchResult,
  analyzeResumesWithGemini,
  saveMatchResults,
  getMatchResultsByJob
  ,getAllMatchResults
};
