const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const { sendCategoryEmail } = require('../utils/email');


// POST /candidates (create candidate from resume)
router.post('/', async (req, res) => {
  // Assume resumeData contains parsed info from resume
  const { resumeData } = req.body;
  // Example: resumeData = { name, email, phone, category, resumeScore }
  try {
    const candidate = new Candidate({
      name: resumeData.name,
      contactInfo: {
        email: resumeData.email,
        phone: resumeData.phone
      },
      category: resumeData.category,
      resumeScore: resumeData.resumeScore,
      status: 'Pending Communication'
    });
    await candidate.save();
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /send-communication
router.post('/send-communication', async (req, res) => {
  const { candidateId } = req.body;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    await sendCategoryEmail(
      candidate.contactInfo.email,
      candidate.name,
      candidate.category
    );
    
    candidate.status = 'Communication Sent';
    await candidate.save();
    res.json({ success: true, message: `Email sent to ${candidate.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /assign-assessment
router.post('/assign-assessment', async (req, res) => {
  const { candidateId, assessmentLink } = req.body;
  try {
    const candidate = await Candidate.findById(candidateId);
    await sendEmail(candidate.contactInfo.email, 'assessment', assessmentLink);
    candidate.status = 'Assessment Assigned';
    await candidate.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /assessment-score/:candidateId
router.get('/assessment-score/:candidateId', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    res.json({ assessmentScore: candidate.assessmentScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
