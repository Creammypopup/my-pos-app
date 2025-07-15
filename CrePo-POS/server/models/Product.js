import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true }, // รหัสสินค้า, sparse: true อนุญาตให้มีหลายเอกสารที่ไม่มีฟิลด์นี้ แต่ถ้ามีต้องไม่ซ้ำกัน
    unit: { type: String, required: true }, // หน่วยนับ เช่น ชิ้น, กล่อง
    cost: { type: Number, required: true, default: 0 }, // ต้นทุน
    price: { type: Number, required: true, default: 0 }, // ราคาขาย
    quantity: { type: Number, required: true, default: 0 }, // จำนวนคงเหลือ
    lowStockThreshold: { type: Number, default: 0 }, // จุดสั่งซื้อ (แจ้งเตือนเมื่อสต็อกต่ำ)
    image: { type: String, default: '/images/sample.jpg' }, // รูปภาพ (ใส่ค่า default ไว้ก่อน)
    category: { type: String }, // หมวดหมู่
    description: { type: String }, // รายละเอียด
  },
  { timestamps: true }
);

// สร้าง SKU อัตโนมัติถ้ายังไม่มี
productSchema.pre('save', async function (next) {
  if (!this.sku) {
    // สร้างเลขสุ่ม 8 หลัก
    const randomSku = Math.floor(10000000 + Math.random() * 90000000).toString();
    this.sku = randomSku;
  }
  next();
});


const Product = mongoose.model('Product', productSchema);
export default Product;