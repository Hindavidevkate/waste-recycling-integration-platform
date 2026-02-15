const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Pickup = require('./models/Pickup');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const allUsers = await User.find({}, 'name email role');
        console.log('--- Users ---');
        allUsers.forEach(u => console.log(`${u.name} (${u.email}) - Role: ${u.role}`));

        console.log('--- Statistics ---');
        console.log('Total Users:', userCount);
        console.log('Producers:', producerCount);
        console.log('Buyers:', buyerCount);
        console.log('Collectors:', collectorCount);
        console.log('Admins:', adminCount);
        console.log('Total Pickups:', pickupCount);
        console.log('Pending Pickups:', pendingPickups);
        console.log('Accepted Pickups:', acceptedPickups);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkData();
