import mongoose from 'mongoose';

// โครงสร้างสำหรับแต่ละหน่วยของสินค้า
const unitDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // เช่น 'ชิ้น', 'โหล', 'ลัง'
  price: { type: Number, required: true },
  cost: { type: Number, required: true, default: 0 },
  // สัมประสิทธิ์การแปลงเทียบกับหน่วยพื้นฐาน (หน่วยเล็กสุด conversionRate = 1)
  // เช่น 'โหล' มี 12 'ชิ้น' -> conversionRate ของโหลคือ 12
  conversionRate: { type: Number, required: true, default: 1 },
  barcode: { type: String, unique: true, sparse: true }
});

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true }, // SKU หลักของสินค้า
    category: { type: String },
    description: { type: String },
    image: { type: String, default: '/images/sample.jpg' },
    
    // ประเภทสินค้า: standard, bundle, service, weighted
    productType: { 
        type: String, 
        required: true, 
        enum: ['standard', 'bundle', 'service', 'weighted'], 
        default: 'standard' 
    },

    // เก็บสต็อกในหน่วยที่เล็กที่สุด (base unit) เสมอ
    quantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 0 }, // แจ้งเตือนเมื่อสต็อก (หน่วยเล็กสุด) ต่ำกว่าค่านี้
    
    // โครงสร้างหน่วยใหม่
    units: [unitDefinitionSchema],

    // สำหรับสินค้าจัดเซ็ต (Bundle)
    bundledItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number } // จำนวนหน่วยเล็กสุดที่ใช้ใน bundle นี้
        }
    ]
  },
  { timestamps: true }
);

// สร้าง SKU อัตโนมัติถ้ายังไม่มี
productSchema.pre('save', async function (next) {
    if (this.isNew && !this.sku) {
        const randomSku = `SKU${Math.floor(100000 + Math.random() * 900000)}`;
        this.sku = randomSku;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;