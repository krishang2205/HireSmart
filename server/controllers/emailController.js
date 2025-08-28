const Candidate = require('../models/Candidate');
const { sendCategoryEmail, sendBulkCategoryEmails } = require('../utils/email');

// Send email to a single candidate based on their category
async function sendEmailToCandidate(req, res) {
	try {
		const { candidateId } = req.body;
		
		if (!candidateId) {
			return res.status(400).json({ 
				success: false, 
				error: 'Candidate ID is required' 
			});
		}

		// Find the candidate
		const candidate = await Candidate.findById(candidateId);
		if (!candidate) {
			return res.status(404).json({ 
				success: false, 
				error: 'Candidate not found' 
			});
		}

		// Check if email has already been sent
		if (candidate.status === 'Communication Sent') {
			return res.status(400).json({ 
				success: false, 
				error: 'Email has already been sent to this candidate' 
			});
		}

		// Send email based on category
		await sendCategoryEmail(
			candidate.contactInfo.email,
			candidate.name,
			candidate.category
		);

		// Update candidate status
		candidate.status = 'Communication Sent';
		await candidate.save();

		res.json({
			success: true,
			message: `Email sent successfully to ${candidate.name}`,
			candidate: {
				id: candidate._id,
				name: candidate.name,
				email: candidate.contactInfo.email,
				category: candidate.category,
				status: candidate.status
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
}

// Send emails to multiple candidates by category
async function sendEmailsByCategory(req, res) {
	try {
		const { category, candidateIds } = req.body;
		
		if (!category) {
			return res.status(400).json({ 
				success: false, 
				error: 'Category is required' 
			});
		}

		let query = { category };
		
		// If specific candidate IDs are provided, filter by them
		if (candidateIds && candidateIds.length > 0) {
			query._id = { $in: candidateIds };
		}

		// Find candidates that haven't received communication yet
		query.status = { $ne: 'Communication Sent' };

		const candidates = await Candidate.find(query);
		
		if (candidates.length === 0) {
			return res.status(404).json({ 
				success: false, 
				error: 'No candidates found for this category or all emails have already been sent' 
			});
		}

		// Send bulk emails
		const results = await sendBulkCategoryEmails(candidates);

		// Update status for successfully sent emails
		const successfulCandidates = results.filter(r => r.success);
		if (successfulCandidates.length > 0) {
			const candidateIds = successfulCandidates.map(r => r.candidateId);
			await Candidate.updateMany(
				{ _id: { $in: candidateIds } },
				{ status: 'Communication Sent' }
			);
		}

		const successCount = successfulCandidates.length;
		const failureCount = results.length - successCount;

		res.json({
			success: true,
			message: `Emails sent: ${successCount} successful, ${failureCount} failed`,
			results: {
				total: results.length,
				successful: successCount,
				failed: failureCount,
				details: results
			}
		});

	} catch (error) {
		console.error('Error sending bulk emails:', error);
		res.status(500).json({ 
			success: false, 
			error: 'Failed to send bulk emails',
			details: error.message 
		});
	}
}

// Send emails to all candidates (all categories)
async function sendEmailsToAllCandidates(req, res) {
	try {
		// Find all candidates that haven't received communication yet
		const candidates = await Candidate.find({ 
			status: { $ne: 'Communication Sent' } 
		});
		
		if (candidates.length === 0) {
			return res.status(404).json({ 
				success: false, 
				error: 'No candidates found or all emails have already been sent' 
			});
		}

		// Send bulk emails
		const results = await sendBulkCategoryEmails(candidates);

		// Update status for successfully sent emails
		const successfulCandidates = results.filter(r => r.success);
		if (successfulCandidates.length > 0) {
			const candidateIds = successfulCandidates.map(r => r.candidateId);
			await Candidate.updateMany(
				{ _id: { $in: candidateIds } },
				{ status: 'Communication Sent' }
			);
		}

		const successCount = successfulCandidates.length;
		const failureCount = results.length - successCount;

		// Group results by category
		const categoryStats = {};
		results.forEach(result => {
			const candidate = candidates.find(c => c._id.toString() === result.candidateId.toString());
			if (candidate) {
				if (!categoryStats[candidate.category]) {
					categoryStats[candidate.category] = { sent: 0, failed: 0 };
				}
				if (result.success) {
					categoryStats[candidate.category].sent++;
				} else {
					categoryStats[candidate.category].failed++;
				}
			}
		});

		res.json({
			success: true,
			message: `Emails sent: ${successCount} successful, ${failureCount} failed`,
			results: {
				total: results.length,
				successful: successCount,
				failed: failureCount,
				categoryStats,
				details: results
			}
		});

	} catch (error) {
		console.error('Error sending emails to all candidates:', error);
		res.status(500).json({ 
			success: false, 
			error: 'Failed to send emails to all candidates',
			details: error.message 
		});
	}
}

// Get email statistics
async function getEmailStats(req, res) {
	try {
		const stats = await Candidate.aggregate([
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 }
				}
			}
		]);

		const categoryStats = await Candidate.aggregate([
			{
				$group: {
					_id: '$category',
					total: { $sum: 1 },
					sent: {
						$sum: {
							$cond: [{ $eq: ['$status', 'Communication Sent'] }, 1, 0]
						}
					},
					pending: {
						$sum: {
							$cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
						}
					}
				}
			}
		]);

		res.json({
			success: true,
			stats: {
				byStatus: stats,
				byCategory: categoryStats
			}
		});

	} catch (error) {
		console.error('Error getting email stats:', error);
		res.status(500).json({ 
			success: false, 
			error: 'Failed to get email statistics',
			details: error.message 
		});
	}
}

module.exports = {
	sendEmailToCandidate,
	sendEmailsByCategory,
	sendEmailsToAllCandidates,
	getEmailStats
};
