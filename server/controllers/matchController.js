const MatchResult = require('../models/MatchResult');

// Insert match results for a job
// matchResults: [{ candidateId, matchScore }, ...], jobId: ObjectId or String
exports.saveMatchResults = async (jobId, matchResults) => {
  // Prepare documents for bulk insert
  const docs = matchResults.map(r => ({
    jobId,
    candidateId: r.candidateId,
    matchScore: r.matchScore
  }));
  // Insert all results
  return await MatchResult.insertMany(docs);
};

// Fetch all match results for a specific jobId, sorted by matchScore descending
exports.getMatchResultsByJob = async (jobId) => {
  return await MatchResult.find({ jobId }).sort({ matchScore: -1 });
};

// Example usage:
// const jobId = '64e3b...';
// const results = await getMatchResultsByJob(jobId);

