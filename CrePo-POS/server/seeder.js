import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import roles from './data/roles.js'; // Import roles data
import products from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Sale from './models/Sale.js';
import Role from './models/Role.js'; // Import Role model
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Role.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    await User.deleteMany();

    // Insert roles first
    const createdRoles = await Role.insertMany(roles);
    console.log('Roles Imported!');

    // Map role names to their corresponding _id
    const roleMap = createdRoles.reduce((acc, role) => {
      acc[role.name] = role._id;
      return acc;
    }, {});

    // Prepare users with correct role _id
    const sampleUsers = users.map((user) => {
      return { ...user, role: roleMap[user.role] };
    });

    // Insert users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log('Users Imported!');

    // Get admin user to associate with products
    const adminUser = createdUsers.find(u => u.username === 'admin');

    // Prepare products with admin user _id
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);
    console.log('Products Imported!');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all data
    await Role.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
