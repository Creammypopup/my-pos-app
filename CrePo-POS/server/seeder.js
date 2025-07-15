import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import roles from './data/roles.js';
import products from './data/products.js'; // ข้อมูลสินค้าใหม่
import User from './models/User.js';
import Product from './models/Product.js';
import Sale from './models/Sale.js';
import Role from './models/Role.js';
import Contact from './models/Contact.js'; // เพิ่ม Contact Model
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // ล้างข้อมูลเก่า
    await Role.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    await User.deleteMany();
    await Contact.deleteMany(); // ล้างข้อมูลผู้ติดต่อด้วย

    // เพิ่ม Roles
    const createdRoles = await Role.insertMany(roles);
    console.log('Roles Imported!');

    const roleMap = createdRoles.reduce((acc, role) => {
      acc[role.name] = role._id;
      return acc;
    }, {});

    // เพิ่ม Users
    const sampleUsers = users.map((user) => {
      return { ...user, role: roleMap[user.role] };
    });
    const createdUsers = await User.insertMany(sampleUsers);
    console.log('Users Imported!');

    // ดึง user แอดมิน
    const adminUser = createdUsers.find(
      (u) => u.username === 'admin'
    );

    // เพิ่ม Products
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
    // ล้างข้อมูลทั้งหมด
    await Role.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    await User.deleteMany();
    await Contact.deleteMany();

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