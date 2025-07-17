import mongoose from 'mongoose';

const unitDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true, default: 0 },
  conversionRate: { type: Number, required: true, default: 1 },
  barcode: { type: String, sparse: true } // ไม่ต้อง unique แล้ว เพื่อความยืดหยุ่น
});

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true },
    category: { type: String },
    description: { type: String },
    image: { type: String, default: '/images/sample.jpg' },
    productType: { 
        type: String, 
        required: true, 
        enum: ['standard', 'bundle', 'service', 'weighted'], 
        default: 'standard' 
    },
    quantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 0 }, 
    units: [unitDefinitionSchema],
    bundledItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number }
        }
    ]
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
    // สร้าง SKU อัตโนมัติถ้ายังไม่มี
    if (this.isNew && !this.sku) {
        const randomSku = `SKU${Math.floor(100000 + Math.random() * 900000)}`;
        this.sku = randomSku;
    }

    // --- สร้าง Barcode อัตโนมัติสำหรับหน่วยที่ยังไม่มี ---
    if (this.units && this.units.length > 0) {
        this.units.forEach((unit, index) => {
            if (!unit.barcode) {
                // สร้างบาร์โค้ดที่ไม่ซ้ำกัน (ใช้ timestamp + index เพื่อลดโอกาสซ้ำ)
                unit.barcode = `ITEM${Date.now()}${index}`;
            }
        });
    }
    // ----------------------------------------------------

    next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;