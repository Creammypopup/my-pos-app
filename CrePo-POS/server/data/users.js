import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin',
    // รหัสผ่านใหม่คือ Pop.za310
    password: bcrypt.hashSync('Pop.za310', 10),
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
