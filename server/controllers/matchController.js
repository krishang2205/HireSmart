const MatchResult = require('../models/MatchResult');
const { analyzeResumeWithGemini } = require('../services/geminiService');
// ...existing code...

// Insert match results for a job
// matchResults: [{ candidateId, matchScore }, ...], jobId: ObjectId or String
async function saveMatchResults(jobId, matchResults) {
  // Prepare documents for bulk insert
  const docs = matchResults.map(r => ({
    jobId,
    candidateId: r.candidateId,
    filename: r.filename,
    prediction: r.prediction,
    matchScore: typeof r.cosine_similarity_score === 'number' ? r.cosine_similarity_score : 0,
    matched_skills: Array.isArray(r.matched_skills) ? r.matched_skills : [],
    explanation: r.explanation || ''
  }));
  // Insert all results
  return await MatchResult.insertMany(docs);
};

// Fetch all match results for a specific jobId, sorted by matchScore descending
async function getMatchResultsByJob(jobId) {
  return await MatchResult.find({ jobId }).sort({ matchScore: -1 });
};



// Gemini-powered match analysis
async function getGeminiMatchResult(resumeText, jobDescription, filename) {
  const geminiResult = await analyzeResumeWithGemini(resumeText, jobDescription, filename);
  // Use the returned object directly, with correct keys
  return {
    filename: geminiResult.filename || filename,
    prediction: geminiResult.prediction || "Not Good Candidate",
    cosine_similarity_score: typeof geminiResult.cosine_similarity_score === 'number' ? geminiResult.cosine_similarity_score : 0,
    matched_skills: Array.isArray(geminiResult.matched_skills) ? geminiResult.matched_skills : [],
    explanation: geminiResult.explanation || '',
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

module.exports = {
  getGeminiMatchResult,
  analyzeResumesWithGemini,
  saveMatchResults,
  getMatchResultsByJob
};
