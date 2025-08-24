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

