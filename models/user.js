const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
});

// User model
module.exports = mongoose.model('User', userSchema);
