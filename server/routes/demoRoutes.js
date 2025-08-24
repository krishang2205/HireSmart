const express = require('express');
const router = express.Router();
const { getMatchResultsByJob } = require('../controllers/matchController');

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

module.exports = router;