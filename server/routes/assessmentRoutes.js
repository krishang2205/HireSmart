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
    const assessment = await createAssessment(req.body);
    res.status(201).json(assessment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create assessment' });
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
