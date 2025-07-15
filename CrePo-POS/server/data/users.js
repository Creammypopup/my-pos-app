import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin',
    // เปลี่ยนรหัสผ่านเริ่มต้นเป็น '123456' เพื่อง่ายต่อการทดสอบ
    password: bcrypt.hashSync('123456', 10),
    role: 'Admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    username: 'john',
    password: bcrypt.hashSync('123456', 10),
    role: 'Sales',
  },
];

export default users;