import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import CustomerOrder from '../models/CustomerOrder.js';
import sendNotification from '../services/notificationService.js';

// @desc    Fetch all products for public view
// @route   GET /api/public/products
// @access  Public
const getPublicProducts = asyncHandler(async (req, res) => {
    // เลือกเฉพาะ field ที่ปลอดภัยสำหรับแสดงผลให้ลูกค้า
    const products = await Product.find({}).select('name sku category description units image productType');
    res.json(products);
});

// @desc    Create a new customer order
// @route   POST /api/public/orders
// @access  Public
const createCustomerOrder = asyncHandler(async (req, res) => {
    const { customerInfo, items, totalAmount, deliveryMethod, shippingAddress } = req.body;

    if (!customerInfo || !items || items.length === 0) {
        res.status(400);
        throw new Error('ข้อมูลการสั่งซื้อไม่สมบูรณ์');
    }

    const order = new CustomerOrder({
        customerInfo,
        items,
        totalAmount,
        deliveryMethod,
        shippingAddress,
        paymentStatus: 'pending', // สถานะเริ่มต้นคือรอชำระเงิน
        orderStatus: 'new'
    });

    const createdOrder = await order.save();

    // Send notification to store owner
    const message = `🎉 มีออเดอร์ใหม่!\nจาก: ${customerInfo.name}\nจำนวน: ${items.length} รายการ\nยอดรวม: ${totalAmount.toLocaleString()} บาท`;
    await sendNotification(message);

    res.status(201).json(createdOrder);
});

export { getPublicProducts, createCustomerOrder };