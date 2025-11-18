const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashed = await require('bcryptjs').hash('adminpass', 12); // Change password
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: "Admin@123",
      role: 'admin'
    });
    console.log('Admin created');
    process.exit();
  });