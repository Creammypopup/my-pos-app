import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // แก้ไขการเชื่อมต่อให้เป็นรูปแบบใหม่
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// เปลี่ยนรูปแบบการส่งออกให้ถูกต้อง
export default connectDB;
