const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
	try {
		const auth = req.headers.authorization;
		if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
		const token = auth.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
		const user = await User.findById(decoded.id).select('-passwordHash');
		if (!user) return res.status(401).json({ message: 'User not found' });
		req.user = user;
		next();
	} catch (e) {
		return res.status(401).json({ message: 'Invalid token' });
	}
};
