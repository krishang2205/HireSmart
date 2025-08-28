const express = require('express');
const router = express.Router();
const {
	sendEmailToCandidate,
	sendEmailsByCategory,
	sendEmailsToAllCandidates,
	getEmailStats
} = require('../controllers/emailController');

// Send email to a single candidate
// POST /api/email/send-single
router.post('/send-single', sendEmailToCandidate);

// Send emails to candidates by category
// POST /api/email/send-by-category
router.post('/send-by-category', sendEmailsByCategory);

// Send emails to all candidates (all categories)
// POST /api/email/send-all
router.post('/send-all', sendEmailsToAllCandidates);

// Get email statistics
// GET /api/email/stats
router.get('/stats', getEmailStats);

module.exports = router;
