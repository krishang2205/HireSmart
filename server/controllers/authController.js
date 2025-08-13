const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

function signToken(user) {
	return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
}

exports.signup = async (req, res) => {
	try {
		const { companyName, fullName, email, phone, password, role, companySize, industry } = req.body;
		
		// Enhanced validation
		if (!companyName || !fullName || !email || !password || !role || !companySize || !industry) {
			return res.status(400).json({ 
				message: 'All required fields must be provided',
				errors: [
					{ field: 'companyName', message: !companyName ? 'Company name is required' : null },
					{ field: 'fullName', message: !fullName ? 'Full name is required' : null },
					{ field: 'email', message: !email ? 'Email is required' : null },
					{ field: 'password', message: !password ? 'Password is required' : null },
					{ field: 'role', message: !role ? 'Role is required' : null },
					{ field: 'companySize', message: !companySize ? 'Company size is required' : null },
					{ field: 'industry', message: !industry ? 'Industry is required' : null }
				].filter(err => err.message)
			});
		}

		// Check if email already exists
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ 
				message: 'Account already exists with this email',
				errors: [{ field: 'email', message: 'An account with this email already exists. Please try logging in instead.' }]
			});
		}

		// Password validation
		if (password.length < 8) {
			return res.status(400).json({
				message: 'Password must be at least 8 characters long',
				errors: [{ field: 'password', message: 'Password must be at least 8 characters long' }]
			});
		}

		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		// Create user without verification requirements
		const user = await User.create({
			companyName, 
			fullName, 
			email, 
			phone, 
			role, 
			companySize, 
			industry,
			passwordHash,
			isVerified: true // Auto-verify users
		});

		// Generate token immediately after signup
		const token = signToken(user);

		res.status(201).json({ 
			message: 'Account created successfully! Welcome to HireSmart.',
			token,
			user: { 
				id: user._id, 
				fullName: user.fullName, 
				role: user.role 
			}
		});
	} catch (e) {
		console.error('Signup error:', e);
		if (e.code === 11000) {
			return res.status(409).json({ 
				message: 'Account already exists with this email',
				errors: [{ field: 'email', message: 'An account with this email already exists. Please try logging in instead.' }]
			});
		}
		res.status(500).json({ message: 'Failed to create account. Please try again.' });
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const { token } = req.query;
		if (!token) return res.status(400).json({ message: 'Token required' });
		const user = await User.findOne({ verificationToken: token, verificationTokenExpires: { $gt: new Date() } });
		if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpires = undefined;
		await user.save();
		res.json({ message: 'Email verified' });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		
		// Enhanced validation
		if (!email || !password) {
			return res.status(400).json({ 
				message: 'Email and password are required',
				errors: [
					{ field: 'email', message: !email ? 'Email is required' : null },
					{ field: 'password', message: !password ? 'Password is required' : null }
				].filter(err => err.message)
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ 
				message: 'Invalid email or password',
				errors: [{ field: 'email', message: 'No account found with this email address' }]
			});
		}

		const match = await user.comparePassword(password);
		if (!match) {
			return res.status(401).json({ 
				message: 'Invalid email or password',
				errors: [{ field: 'password', message: 'Incorrect password' }]
			});
		}

		// Remove email verification check
		// if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });
		
		const token = signToken(user);
		res.json({ 
			token, 
			user: { 
				id: user._id, 
				fullName: user.fullName, 
				role: user.role 
			},
			message: 'Login successful'
		});
	} catch (e) {
		console.error('Login error:', e);
		res.status(500).json({ message: 'Login failed. Please try again.' });
	}
};

exports.requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });
		const resetToken = crypto.randomBytes(32).toString('hex');
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
		await user.save();
		const resetUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
			sendEmail(email, 'Reset your HireSmart password', `Reset here: ${resetUrl}`).catch(err => console.error(err));
			if (process.env.NODE_ENV !== 'production') {
				console.log('[DEV] Password reset link:', resetUrl);
			}
		res.json({ message: 'If that email exists, a reset link was sent' });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body;
		if (!token || !password) return res.status(400).json({ message: 'Token and password required' });
		const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
		if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
		const salt = await bcrypt.genSalt(10);
		user.passwordHash = await bcrypt.hash(password, salt);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();
		res.json({ message: 'Password updated' });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.me = async (req, res) => {
	try {
		res.json({ user: req.user });
	} catch (e) { res.status(500).json({ message: 'Server error' }); }
};
