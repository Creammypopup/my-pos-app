import mongoose from 'mongoose';
const saleSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  saleItems: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  }],
  paymentMethod: { type: String, required: true },
  paymentResult: { id: String, status: String, update_time: String, email_address: String },
  taxPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
}, { timestamps: true });
const Sale = mongoose.model('Sale', saleSchema);
export default Sale;