const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:5000/api';
let token = '';
let adminId = '';

function log(msg) {
    console.log(msg);
    fs.appendFileSync('verification_log.txt', msg + '\n');
}

async function runVerification() {
    log('🚀 Starting Admin Verification...');

    try {
        // 1. Register/Login Admin
        log('\n--- 1. Authenticating Admin ---');
        const adminEmail = `admin_test_${Date.now()}@example.com`;
        const adminPassword = 'password123';

        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                phone: '1234567890',
                address: 'Admin HQ'
            });
            token = regRes.data.token;
            adminId = regRes.data.user.id;
            log('✅ Admin Registered successfully');
        } catch (e) {
            log('⚠️ Registration failed.');
            if (e.response) log('Reg Status: ' + e.response.status + ' Data: ' + JSON.stringify(e.response.data));
            else log('Reg Error: ' + e.message + ' Code: ' + e.code);

            log('Trying login...');
            try {
                const loginRes = await axios.post(`${API_URL}/auth/login`, {
                    email: adminEmail,
                    password: adminPassword
                });
                token = loginRes.data.token;
                adminId = loginRes.data.user.id;
                log('✅ Admin Logged in successfully');
            } catch (loginErr) {
                log('❌ Login failed.');
                if (loginErr.response) log('Login Status: ' + loginErr.response.status + ' Data: ' + JSON.stringify(loginErr.response.data));
                else log('Login Error: ' + loginErr.message + ' Code: ' + loginErr.code);
                throw new Error('Authentication failed');
            }
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Test Dashboard Stats
        log('\n--- 2. Testing Dashboard Stats ---');
        const statsRes = await axios.get(`${API_URL}/reports/dashboard-stats`, config);
        log('✅ Stats fetched: ' + JSON.stringify(statsRes.data));

        // 3. Test Waste Categories
        log('\n--- 3. Testing Waste Categories (CRUD) ---');
        // Create
        const catRes = await axios.post(`${API_URL}/waste-categories`, {
            name: `Plastic-${Date.now()}`,
            description: 'Recyclable Plastic',
            pricePerKg: 10,
            unit: 'kg'
        }, config);
        log('✅ Category Created: ' + catRes.data.name);

        // Read
        const catsRes = await axios.get(`${API_URL}/waste-categories`, config);
        log(`✅ Categories Fetched: ${catsRes.data.length} items`);

        // 4. Test User Management
        log('\n--- 4. Testing User Management ---');
        const usersRes = await axios.get(`${API_URL}/admin/users`, config);
        log(`✅ Users Fetched: ${usersRes.data.length} users`);

        // 5. Test Complaints
        log('\n--- 5. Testing Complaints ---');
        // Create complaint as admin (just for test)
        const compRes = await axios.post(`${API_URL}/complaints`, {
            subject: 'Test Complaint',
            description: 'This is a test'
        }, config);
        log('✅ Complaint Created');

        // Resolve it
        await axios.put(`${API_URL}/complaints/${compRes.data._id}/resolve`, {
            status: 'resolved',
            adminResponse: 'Fixed it'
        }, config);
        log('✅ Complaint Resolved');

        log('\n✨ ALL TESTS PASSED! Backend is functional. ✨');

    } catch (err) {
        log('\n❌ VERIFICATION FAILED');
        if (err.response) {
            log('Status: ' + err.response.status);
            log('Data: ' + JSON.stringify(err.response.data));
        } else {
            log('Error Message: ' + err.message);
            log('Error Code: ' + err.code);
            if (err.cause) log('Cause: ' + err.cause);
        }
    }
}

runVerification();
