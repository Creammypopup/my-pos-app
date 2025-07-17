import mongoose from 'mongoose';
import Counter from './Counter.js';

const customerOrderSchema = mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        name: { type: String, required: true },
        unitName: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    productTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
    deliveryMethod: { type: String, required: true, enum: ['pickup', 'delivery'] },
    shippingAddress: { type: String },
    paymentStatus: { type: String, required: true, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, required: true, enum: ['new', 'confirmed', 'preparing', 'shipped', 'completed', 'cancelled'], default: 'new' },
}, { timestamps: true });

customerOrderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'customerOrderNumber' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.orderNumber = `CUS-ORD-${String(counter.seq).padStart(6, '0')}`;
    }
    // คำนวณยอดรวมสุดท้ายทุกครั้งที่มีการบันทึก
    this.finalTotal = this.productTotal + this.deliveryFee;
    next();
});

const CustomerOrder = mongoose.model('CustomerOrder', customerOrderSchema);
export default CustomerOrder;