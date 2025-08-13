// Express server entry for HireSmart auth & API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: Date.now() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
