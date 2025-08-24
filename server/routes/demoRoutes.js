const express = require('express');
const router = express.Router();
const { getMatchResultsByJob, saveMatchResults } = require('../controllers/matchController');

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

module.exports = router;