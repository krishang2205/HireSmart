const nodemailer = require('nodemailer');

let transporter;
function getTransporter() {
	if (transporter) return transporter;
	transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		}
	});
	return transporter;
}

// Email templates for different candidate categories
const emailTemplates = {
	'Not Good Candidate': {
		subject: 'Application Status - HireSmart',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
				<p>Dear {{candidateName}},</p>
				
				<p>Thank you for your interest in joining our team and for taking the time to submit your application to HireSmart.</p>
				
				<p>After carefully reviewing your application and resume, we regret to inform you that we will not be moving forward with your candidacy at this time. This decision was made after a thorough evaluation of your qualifications against our current requirements.</p>
				
				<p>We appreciate the time and effort you invested in your application. We encourage you to continue developing your skills and to apply for future opportunities that may be a better fit for your background and experience.</p>
				
				<p>We wish you the very best in your future endeavors and thank you again for your interest in our company.</p>
				
				<p>Best regards,<br>
				The HireSmart Team</p>
			</div>
		`
	},
	'Can consider for interview': {
		subject: 'Next Steps - HireSmart Application',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
				<p>Dear {{candidateName}},</p>
				
				<p>Thank you for your application to HireSmart! We're pleased to inform you that your profile has caught our attention.</p>
				
				<p>Your background and experience look promising, and we'd like to learn more about your skills and capabilities. As part of our selection process, we'd like you to complete a short assessment that will help us better understand your technical abilities and problem-solving approach.</p>
				
				<p><strong>Next Steps:</strong></p>
				<ul>
					<li>Complete the technical assessment (estimated time: 30-45 minutes)</li>
					<li>Assessment will be sent to you within 24 hours</li>
					<li>We'll review your results and get back to you within 3-5 business days</li>
				</ul>
				
				<p>This assessment is designed to evaluate your technical skills and is an important part of our selection process. Please complete it at your earliest convenience.</p>
				
				<p>We look forward to reviewing your assessment and potentially moving forward with your application!</p>
				
				<p>Best regards,<br>
				The HireSmart Team</p>
			</div>
		`
	},
	'Best Match': {
		subject: 'Congratulations - You\'ve Been Shortlisted - HireSmart',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
				<p>Dear {{candidateName}},</p>
				
				<p>Congratulations! We're thrilled to inform you that your application has been shortlisted for the next phase of our selection process.</p>
				
				<p>Your impressive background, skills, and experience have made you stand out among our candidates. Our AI-powered screening system has identified you as one of the top matches for this position.</p>
				
				<p><strong>What's Next:</strong></p>
				<ul>
					<li><strong>Technical Assessment:</strong> Complete our comprehensive technical evaluation</li>
					<li><strong>Interview Preparation:</strong> We'll provide you with interview guidelines</li>
					<li><strong>Final Interview:</strong> Meet with our hiring team</li>
				</ul>
				
				<p>You'll receive detailed instructions for the next steps within the next 24 hours. Please keep an eye on your email for further communications.</p>
				
				<p>We're excited about the possibility of having you join our team and look forward to getting to know you better throughout this process.</p>
				
				<p>Best regards,<br>
				The HireSmart Team</p>
			</div>
		`
	},
	'Consider with Caution': {
		subject: 'Additional Information Needed - HireSmart Application',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
				<p>Dear {{candidateName}},</p>
				
				<p>Thank you for your application to HireSmart. We've reviewed your profile and would like to gather some additional information to better assess your fit for this position.</p>
				
				<p>While your background shows potential, we'd like to understand certain aspects of your experience and skills more thoroughly through a targeted assessment.</p>
				
				<p><strong>Next Steps:</strong></p>
				<ul>
					<li>Complete a focused skills assessment</li>
					<li>Provide additional portfolio or work samples if applicable</li>
					<li>We'll review your responses and provide feedback</li>
				</ul>
				
				<p>This assessment will help us make a more informed decision about your application. Please complete it within the next 48 hours.</p>
				
				<p>We appreciate your understanding and look forward to reviewing your additional information.</p>
				
				<p>Best regards,<br>
				The HireSmart Team</p>
			</div>
		`
	}
};

async function sendEmail(to, subject, text, html) {
	const t = getTransporter();
	return t.sendMail({ 
		from: process.env.GMAIL_USER, 
		to, 
		subject, 
		text, 
		html: html || `<p>${text}</p>` 
	});
}

// Function to send category-based email
async function sendCategoryEmail(candidateEmail, candidateName, category) {
	const template = emailTemplates[category];
	if (!template) {
		throw new Error(`No email template found for category: ${category}`);
	}

	// Replace placeholders in the template
	const personalizedHtml = template.html.replace(/{{candidateName}}/g, candidateName || 'Candidate');
	
	return sendEmail(
		candidateEmail,
		template.subject,
		`Email for ${category} category`, // Fallback text
		personalizedHtml
	);
}

// Function to send bulk emails to multiple candidates
async function sendBulkCategoryEmails(candidates) {
	const results = [];
	
	for (const candidate of candidates) {
		try {
			await sendCategoryEmail(
				candidate.contactInfo.email,
				candidate.name,
				candidate.category
			);
			results.push({
				candidateId: candidate._id,
				email: candidate.contactInfo.email,
				status: 'sent',
				success: true
			});
		} catch (error) {
			results.push({
				candidateId: candidate._id,
				email: candidate.contactInfo.email,
				status: 'failed',
				success: false,
				error: error.message
			});
		}
	}
	
	return results;
}

module.exports = { 
	sendEmail, 
	sendCategoryEmail, 
	sendBulkCategoryEmails,
	emailTemplates 
};
