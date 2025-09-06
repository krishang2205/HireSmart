const mongoose = require('mongoose');
const { sendCategoryEmail } = require('../utils/email');
require('dotenv').config({ path: '../../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiresmart', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

async function testEmailTemplates() {
	try {
		console.log('Testing email templates...\n');

		// Test data for different categories
		const testCandidates = [
			{
				name: 'John Doe',
				email: 'test1@example.com',
				category: 'Best Match'
			},
			{
				name: 'Jane Smith',
				email: 'test2@example.com',
				category: 'Can consider for interview'
			},
			{
				name: 'Bob Johnson',
				email: 'test3@example.com',
				category: 'Not Good Candidate'
			},
			{
				name: 'Alice Brown',
				email: 'test4@example.com',
				category: 'Consider with Caution'
			}
		];

		for (const candidate of testCandidates) {
			console.log(`Testing email for ${candidate.name} (${candidate.category})...`);
			
			try {
				await sendCategoryEmail(
					candidate.email,
					candidate.name,
					candidate.category
				);
				console.log(`✅ Email sent successfully to ${candidate.name}`);
			} catch (error) {
				console.log(`❌ Failed to send email to ${candidate.name}: ${error.message}`);
			}
			
			console.log('---');
		}

		console.log('Email template testing completed!');
		
	} catch (error) {
		console.error('Error testing email templates:', error);
	} finally {
		await mongoose.disconnect();
	}
}

// Run the test
testEmailTemplates();
