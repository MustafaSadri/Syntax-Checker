const mongoose = require('mongoose');
const User = require('../models/user');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/syntax-checker');
    console.log('Connected to database');

    // Sample users
    const users = [
        { username: 'user1', email: 'user1@example.com', password: 'password123' },
        { username: 'user2', email: 'user2@example.com', password: 'password123' }
    ];

    for (let userData of users) {
        const user = new User(userData);
        await user.save();
    }

    console.log('Sample users created');
    mongoose.connection.close();
}

main().catch(err => console.log(err));
