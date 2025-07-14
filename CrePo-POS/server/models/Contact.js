import mongoose from 'mongoose';
const contactSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  type: { type: String, required: true, enum: ['Customer', 'Supplier'] },
}, { timestamps: true });
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;