const express = require('express');
const router = express.Router();
const {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAvailableJobRoles
} = require('../controllers/assessmentController');

// In-memory store for latest links received from external app
let latestExternalLinks = [];

// GET /api/assessments/job-roles - Get all available job roles
router.get('/job-roles', async (req, res) => {
  try {
    const jobRoles = await getAvailableJobRoles();
    res.json(jobRoles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job roles' });
  }
});

// GET /api/assessments - Get all assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await getAllAssessments();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// GET /api/assessments/:id - Get assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const assessment = await getAssessmentById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// POST /api/assessments - Create new assessment
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/assessments: Request received');
    console.log('POST /api/assessments: Request body:', JSON.stringify(req.body, null, 2));
    console.log('POST /api/assessments: Request headers:', req.headers);
    
    const assessment = await createAssessment(req.body);
    console.log('POST /api/assessments: Assessment created successfully');
    res.status(201).json(assessment);
  } catch (err) {
    console.error('POST /api/assessments: Error occurred:', err);
    console.error('POST /api/assessments: Error message:', err.message);
    console.error('POST /api/assessments: Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to create assessment', details: err.message });
  }
});

// POST /api/assessments/external/assessment-links
// Endpoint to accept generated test links from an external app
router.post('/external/assessment-links', async (req, res) => {
  try {
    const payload = req.body;
    const links = Array.isArray(payload?.links)
      ? payload.links
      : Array.isArray(payload)
        ? payload
        : payload?.testLinks || payload?.urls || [];

    console.log('Received external assessment links:', links);
    latestExternalLinks = Array.isArray(links) ? links : [];
    // TODO: persist or associate links with an assessment/candidate if needed
    return res.status(200).json({ status: 'ok', received: Array.isArray(links) ? links.length : 0 });
  } catch (err) {
    console.error('Failed to handle external assessment links:', err);
    return res.status(500).json({ error: 'Failed to handle external assessment links' });
  }
});

// GET /api/assessments/external/assessment-links
// Returns latest received links (in-memory)
router.get('/external/assessment-links', async (req, res) => {
  try {
    return res.json({ links: latestExternalLinks });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch external assessment links' });
  }
});

// PUT /api/assessments/:id - Update assessment
router.put('/:id', async (req, res) => {
  try {
    const assessment = await updateAssessment(req.params.id, req.body);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update assessment' });
  }
});

// DELETE /api/assessments/:id - Delete assessment
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteAssessment(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
});

module.exports = router;
