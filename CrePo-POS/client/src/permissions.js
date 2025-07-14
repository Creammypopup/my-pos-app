// รายการสิทธิ์ทั้งหมดในระบบ
export const ALL_PERMISSIONS = [
    // ภาพรวม
    { id: 'dashboard-view', name: 'ดูหน้าภาพรวม' },

    // ขายหน้าร้าน
    { id: 'pos-access', name: 'เข้าถึงหน้าขายหน้าร้าน (POS)' },

    // เอกสารขาย
    { id: 'sales-docs-view', name: 'ดูเอกสารขาย' },
    { id: 'quotations-manage', name: 'จัดการใบเสนอราคา' },
    { id: 'invoices-manage', name: 'จัดการใบแจ้งหนี้' },
    { id: 'receipts-manage', name: 'จัดการใบเสร็จ' },

    // เอกสารซื้อ
    { id: 'purchase-docs-view', name: 'ดูเอกสารซื้อ' },
    { id: 'expenses-manage', name: 'จัดการค่าใช้จ่าย' },
    { id: 'purchase-orders-manage', name: 'จัดการใบสั่งซื้อ' },

    // บัญชี
    { id: 'accounting-view', name: 'ดูหน้าบริหารบัญชี' },
    { id: 'chart-of-accounts-manage', name: 'จัดการผังบัญชี' },
    { id: 'journal-manage', name: 'จัดการสมุดรายวัน' },

    // สินค้า
    { id: 'products-view', name: 'ดูสินค้า' },
    { id: 'products-manage', name: 'จัดการสินค้า (เพิ่ม/ลบ/แก้)' },
    { id: 'stock-adjustments-manage', name: 'จัดการการปรับสต็อก' },

    // อื่นๆ
    { id: 'contacts-manage', name: 'จัดการผู้ติดต่อ' },
    { id: 'reports-view', name: 'ดูรายงาน' },

    // ตั้งค่า (สิทธิ์สูงสุด)
    { id: 'settings-access', name: 'เข้าถึงหน้าตั้งค่า' },
    { id: 'users-manage', name: 'จัดการผู้ใช้งาน' },
    { id: 'roles-manage', name: 'จัดการตำแหน่งและสิทธิ์' },
    { id: 'theme-settings-manage', name: 'จัดการดีไซน์' },
    { id: 'general-settings-manage', name: 'จัดการตั้งค่าทั่วไป' },
];
