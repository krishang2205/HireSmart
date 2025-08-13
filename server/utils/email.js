const nodemailer = require('nodemailer');

let transporter;
function getTransporter() {
	if (transporter) return transporter;
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
		port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 2525,
		auth: {
			user: process.env.SMTP_USER || 'user',
			pass: process.env.SMTP_PASS || 'pass'
		}
	});
	return transporter;
}

async function sendEmail(to, subject, text, html) {
	const t = getTransporter();
	return t.sendMail({ from: process.env.MAIL_FROM || 'hiresmart@app.local', to, subject, text, html: html || `<p>${text}</p>` });
}

module.exports = { sendEmail };
