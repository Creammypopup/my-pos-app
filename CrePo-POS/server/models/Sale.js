import mongoose from 'mongoose';
import Counter from './Counter.js';

const paymentSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, required: true },
  notes: { type: String }
}, { _id: false });


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
  
  // --- Fields for Accounts Receivable ---
  paymentStatus: {
    type: String,
    required: true,
    enum: ['paid', 'unpaid', 'partial'],
    default: 'paid'
  },
  amountPaid: {
    type: Number,
    required: true,
    default: 0.0
  },
  balance: {
    type: Number,
    required: true,
    default: 0.0
  },
  dueDate: {
    type: Date
  },
  payments: [paymentSchema], // เก็บประวัติการชำระเงิน
  // --- End of AR Fields ---

  paymentMethod: { type: String, required: true },
  isPaid: { type: Boolean, required: true, default: true },
  paidAt: { type: Date },
}, { timestamps: true });


saleSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'receiptNumber' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const seqPadded = counter.seq.toString().padStart(5, '0');
            
            this.receiptNumber = `RE-${year}${month}-${seqPadded}`;
        } catch (error) {
            return next(error);
        }
    }

    // คำนวณยอดคงเหลือ
    this.balance = this.total - this.amountPaid;

    // อัปเดตสถานะการชำระเงิน
    if (this.balance <= 0) {
        this.paymentStatus = 'paid';
        this.isPaid = true;
        if (!this.paidAt) {
            this.paidAt = new Date();
        }
    } else if (this.amountPaid > 0 && this.balance > 0) {
        this.paymentStatus = 'partial';
        this.isPaid = false;
    } else {
        this.paymentStatus = 'unpaid';
        this.isPaid = false;
    }

    next();
});


const Sale = mongoose.model('Sale', saleSchema);
export default Sale;