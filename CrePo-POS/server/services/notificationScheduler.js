import Sale from '../models/Sale.js';
import sendNotification from './notificationService.js';

export const checkOverdueBills = async () => {
    try {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        const unpaidSales = await Sale.find({
            paymentStatus: { $in: ['unpaid', 'partial'] },
            dueDate: { $ne: null }
        }).populate('customer', 'name');

        for (const sale of unpaidSales) {
            const dueDate = new Date(sale.dueDate);
            let message = '';

            if (dueDate < today) {
                // เลยกำหนด
                message = `🔴 เลยกำหนดชำระ! บิล #${sale.receiptNumber} ของคุณ ${sale.customer.name} เลยกำหนดแล้ว ยอดคงเหลือ ${sale.balance.toLocaleString()} บาท`;
            } else if (dueDate <= threeDaysFromNow) {
                // ใกล้ครบกำหนด
                const dueDateString = dueDate.toLocaleDateString('th-TH');
                message = `🟡 ใกล้ครบกำหนด! บิล #${sale.receiptNumber} ของคุณ ${sale.customer.name} จะครบกำหนดวันที่ ${dueDateString} ยอดคงเหลือ ${sale.balance.toLocaleString()} บาท`;
            }
            
            if (message) {
                await sendNotification(message);
            }
        }
    } catch (error) {
        console.error('Error checking overdue bills:', error);
    }
};