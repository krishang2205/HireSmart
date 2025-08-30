
const express = require('express');
const router = express.Router();
const { getMatchResultsByJob, saveMatchResults, analyzeResumesWithGemini, getAllMatchResults } = require('../controllers/matchController');
const { sendCategoryEmail } = require('../utils/email');
const MatchResult = require('../models/MatchResult');
const Job = require('../models/Job');

// GET /api/match-results (all results)
router.get('/match-results', async (req, res) => {
  try {
    const results = await getAllMatchResults();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all match results' });
  }
});

// POST /api/match-results/send-email - Send email using MatchResult data (MUST come before :jobId route)
router.post('/match-results/send-email', async (req, res) => {
  const { candidateId } = req.body;
  try {
    const matchResult = await MatchResult.findById(candidateId);
    if (!matchResult) {
      return res.status(404).json({ 
        success: false, 
        error: 'Candidate not found' 
      });
    }

    // Check if email has already been sent
    if (matchResult.status === 'Communication Sent') {
      return res.status(400).json({ 
        success: false, 
        error: 'Email has already been sent to this candidate' 
      });
    }

    // Send email based on category
    await sendCategoryEmail(
      matchResult.email,
      matchResult.candidateName,
      matchResult.prediction
    );

    // Update match result status
    matchResult.status = 'Communication Sent';
    await matchResult.save();

    res.json({
      success: true,
      message: `Email sent successfully to ${matchResult.candidateName}`,
      candidate: {
        id: matchResult._id,
        name: matchResult.candidateName,
        email: matchResult.email,
        category: matchResult.prediction,
        status: matchResult.status
      }
    });

  } catch (error) {
    console.error('Error sending email to candidate:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// GET /api/match-results/:jobId
router.get('/match-results/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const results = await getMatchResultsByJob(jobId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch match results' });
  }
});

// GET /api/match-results/role/:jobRole - fetch candidates by job role (case-insensitive)
router.get('/match-results/role/:jobRole', async (req, res) => {
  try {
    const jobRole = req.params.jobRole || '';
    // Use case-insensitive regex to match jobRole field
    const safe = jobRole.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${safe}$`, 'i');

    // First match MatchResult.jobRole
    const directMatches = await MatchResult.find({ jobRole: regex }).sort({ matchScore: -1 });

    // Also find Job documents with this role and fetch MatchResults by jobId
    const jobs = await Job.find({ jobRole: regex }, 'jobId');
    const jobIds = jobs.map(j => j.jobId).filter(Boolean);
    let byJobIdMatches = [];
    if (jobIds.length > 0) {
      byJobIdMatches = await MatchResult.find({ jobId: { $in: jobIds } }).sort({ matchScore: -1 });
    }

    // Combine unique results by _id or candidateId
    const map = new Map();
    directMatches.concat(byJobIdMatches).forEach(r => {
      const key = r._id ? String(r._id) : (r.candidateId || r.filename || JSON.stringify(r));
      if (!map.has(key)) map.set(key, r);
    });

    res.json(Array.from(map.values()));
  } catch (err) {
    console.error('Failed to fetch match results by role:', err);
    res.status(500).json({ error: 'Failed to fetch match results by role' });
  }
});

// POST /api/match-results/:jobId
router.post('/match-results/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const matchResults = req.body.matchResults;
    const jobDescription = req.body.jobDescription;
    if (!Array.isArray(matchResults)) {
      return res.status(400).json({ error: 'matchResults must be an array' });
    }
    const saved = await saveMatchResults(jobId, matchResults, jobDescription);
    res.json({ success: true, saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save match results' });
  }
});

// POST /api/gemini-match
router.post('/gemini-match', async (req, res) => {
  try {
    console.log('Received /api/gemini-match request:', req.body);
    const { resumes, jobDescription } = req.body;
    if (!Array.isArray(resumes) || !jobDescription) {
      console.error('Request missing resumes or jobDescription:', req.body);
      return res.status(400).json({ error: 'Missing resumes or jobDescription' });
    }
    const results = await analyzeResumesWithGemini(resumes, jobDescription);
    console.log('Gemini match results:', results);
    res.json(results);
  } catch (err) {
    console.error('Error in /api/gemini-match:', err);
    res.status(500).json({ error: 'Gemini match failed', details: err.message });
  }
});

module.exports = router;