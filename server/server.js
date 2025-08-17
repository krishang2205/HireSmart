// Express server entry for HireSmart auth & API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const nodemailer = require('nodemailer');

const app = express();

// Basic security / parsing middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rate limiting (generic)
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false
});
app.use('/api/auth', authLimiter);

// Connect DB
connectDB().catch(err => {
	console.error('DB connection failed', err);
	process.exit(1);
});

// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER, // your Gmail address
		pass: process.env.GMAIL_PASS, // your Gmail app password
	},
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/request-demo', async (req, res) => {
	const { email } = req.body;
	if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
		return res.status(400).json({ error: 'Invalid email' });
	}
	try {
		// Send email to admin
		await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: process.env.ADMIN_EMAIL, // your admin email
			subject: 'New Demo Request',
			text: `Demo requested by: ${email}`,
		});
		// Send confirmation to user
		await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: email,
			subject: 'HireSmart Demo Request Received',
			text: 'Thank you for requesting a demo! Our team will contact you soon.',
		});
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to send email' });
	}
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
