// ข้อมูลสินค้าตัวอย่างที่สอดคล้องกับ Model ใหม่
const products = [
  {
    name: 'ครีมกันแดดสูตรพิเศษ',
    sku: 'SKU-SUN-001',
    unit: 'หลอด',
    cost: 150,
    price: 299,
    quantity: 50,
    lowStockThreshold: 10,
    category: 'ผลิตภัณฑ์ดูแลผิวหน้า',
    description: 'ครีมกันแดด SPF50+ PA++++ สำหรับผิวแพ้ง่าย',
  },
  {
    name: 'เซรั่มวิตามินซีเข้มข้น',
    sku: 'SKU-SERUM-001',
    unit: 'ขวด',
    cost: 250,
    price: 490,
    quantity: 30,
    lowStockThreshold: 5,
    category: 'ผลิตภัณฑ์ดูแลผิวหน้า',
    description: 'ช่วยลดเลือนจุดด่างดำและปรับผิวกระจ่างใส',
  },
  {
    name: 'ลิปสติกสีชมพูพีช',
    sku: 'SKU-LIP-001',
    unit: 'แท่ง',
    cost: 80,
    price: 159,
    quantity: 100,
    lowStockThreshold: 20,
    category: 'เครื่องสำอาง',
    description: 'ลิปสติกเนื้อแมตต์ ติดทนนาน ไม่ตกร่อง',
  },
];

export default products;