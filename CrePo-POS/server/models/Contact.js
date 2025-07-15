import mongoose from 'mongoose';
const contactSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  taxId: { type: String }, // เพิ่มฟิลด์ เลขผู้เสียภาษี
  branch: { type: String }, // เพิ่มฟิลด์ รหัสสาขา
  contactType: { type: String, required: true, enum: ['customer', 'supplier'] }, // เปลี่ยนชื่อฟิลด์และค่า enum
}, { timestamps: true });
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;