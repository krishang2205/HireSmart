const mongoose = require('mongoose');

async function connectDB() {
	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hiresmart';
	await mongoose.connect(uri, {
		autoIndex: true
	});
	console.log('MongoDB connected');
}

module.exports = { connectDB };
