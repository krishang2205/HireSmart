const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	companyName: { type: String, required: true, trim: true },
	fullName: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, index: true, validate: [validator.isEmail, 'Invalid email'] },
	phone: { type: String },
	role: { type: String, enum: ['HR Manager', 'Recruiter', 'Hiring Team Member', 'Admin'], default: 'Recruiter' },
	companySize: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '500+'] },
	industry: { type: String },
	passwordHash: { type: String, required: true },
	isVerified: { type: Boolean, default: true }, // Auto-verify users
	verificationToken: { type: String, required: false }, // Optional since we don't use email verification
	verificationTokenExpires: { type: Date, required: false }, // Optional since we don't use email verification
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date }
}, { timestamps: true });

userSchema.methods.comparePassword = async function(candidate) {
	return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.pre('save', function(next) {
	// ensure tokens expiry are Date objects etc (placeholder for future logic)
	next();
});

module.exports = mongoose.model('User', userSchema);
