import asyncHandler from 'express-async-handler';
import CustomerOrder from '../models/CustomerOrder.js';
import sendNotification from '../services/notificationService.js';

// @desc    Get all customer orders
// @route   GET /api/customer-orders
// @access  Private
const getCustomerOrders = asyncHandler(async (req, res) => {
    const orders = await CustomerOrder.find({}).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Update an order (confirm, add delivery fee, etc.)
// @route   PUT /api/customer-orders/:id
// @access  Private
const updateCustomerOrder = asyncHandler(async (req, res) => {
    const { orderStatus, deliveryFee } = req.body;
    const order = await CustomerOrder.findById(req.params.id);

    if (order) {
        order.orderStatus = orderStatus || order.orderStatus;
        order.deliveryFee = deliveryFee !== undefined ? deliveryFee : order.deliveryFee;
        
        const updatedOrder = await order.save();
        
        // Send notification
        const message = `🔔 อัปเดตออเดอร์\n#${updatedOrder.orderNumber}\nสถานะ: ${updatedOrder.orderStatus}\nค่าส่ง: ${updatedOrder.deliveryFee} บาท\nยอดรวมใหม่: ${updatedOrder.finalTotal.toLocaleString()} บาท`;
        await sendNotification(message);

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export { getCustomerOrders, updateCustomerOrder };