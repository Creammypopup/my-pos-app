import mongoose from 'mongoose';
const contactSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  taxId: { type: String }, 
  branch: { type: String }, 
  contactType: { type: String, required: true, enum: ['customer', 'supplier'] },
  
  // --- Fields for Credit Control ---
  creditLimit: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 }, // ยอดหนี้คงค้าง
  // --- End of Credit Control ---

}, { timestamps: true });
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;