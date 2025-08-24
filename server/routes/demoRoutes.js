const express = require('express');
const router = express.Router();
const { getMatchResultsByJob, saveMatchResults, analyzeResumesWithGemini } = require('../controllers/matchController');

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

// POST /api/match-results/:jobId
router.post('/match-results/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const matchResults = req.body.matchResults;
    if (!Array.isArray(matchResults)) {
      return res.status(400).json({ error: 'matchResults must be an array' });
    }
    const saved = await saveMatchResults(jobId, matchResults);
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