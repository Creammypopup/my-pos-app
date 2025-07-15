import mongoose from 'mongoose';
import Counter from './Counter.js';

const saleSchema = mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true, default: 0.0 },
  discount: { type: Number, required: true, default: 0.0 },
  total: { type: Number, required: true, default: 0.0 },
  paymentMethod: { type: String, required: true },
  isPaid: { type: Boolean, required: true, default: true },
  paidAt: { type: Date, default: Date.now },
}, { timestamps: true });


saleSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'receiptNumber' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            // Format: RE-YYYYMM-XXXXX (เช่น RE-202507-00001)
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const seqPadded = counter.seq.toString().padStart(5, '0');
            
            this.receiptNumber = `RE-${year}${month}-${seqPadded}`;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


const Sale = mongoose.model('Sale', saleSchema);
export default Sale;