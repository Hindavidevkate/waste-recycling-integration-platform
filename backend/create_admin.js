const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123';

        let user = await User.findOne({ email: adminEmail });
        if (user) {
            console.log('Admin user already exists. Updating role...');
            user.role = 'admin';
            await user.save();
            console.log('Admin user updated successfully');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            user = new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                phone: '0000000000',
                address: 'System HQ'
            });

            await user.save();
            console.log('Admin user created successfully');
            console.log('Email:', adminEmail);
            console.log('Password:', adminPassword);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

createAdmin();
