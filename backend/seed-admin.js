const User = require('./models/User');
const db = require('./config/db');

async function seedAdmin() {
    const adminData = {
        name: 'Master Admin',
        email: 'admin@farshe.com',
        password: 'adminpassword123',
        securityQuestion: 'Brand Name',
        securityAnswer: 'Farshe'
    };

    console.log('Checking for existing admin...');
    const existing = await User.findOne({ email: adminData.email });

    if (existing) {
        console.log('Admin already exists. Upgrading to Admin status just in case...');
        db.prepare('UPDATE users SET isAdmin = 1 WHERE email = ?').run(adminData.email);
        console.log('Admin upgraded successfully.');
    } else {
        console.log('Creating new Master Admin...');
        await User.create(adminData);
        db.prepare('UPDATE users SET isAdmin = 1 WHERE email = ?').run(adminData.email);
        console.log('Master Admin created and elevated successfully.');
    }
    
    process.exit(0);
}

seedAdmin();
