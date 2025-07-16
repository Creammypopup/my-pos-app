import axios from 'axios';

// บริการสำหรับส่งการแจ้งเตือนไปยัง LINE ผ่าน Notify Gateway
// ใช้ Token ที่คุณให้มา
const NOTIFY_GATEWAY_TOKEN = 'Cfda53c4220cbf083eaefae9fdad9aa5e';
const API_URL = 'https://notify-gateway.vercel.app/api/notify';

/**
 * ฟังก์ชันสำหรับส่งข้อความแจ้งเตือน
 * @param {string} message - ข้อความที่ต้องการส่ง
 */
const sendNotification = async (message) => {
  if (!NOTIFY_GATEWAY_TOKEN) {
    console.log('Notify Gateway token is not set. Skipping notification.');
    return;
  }
  
  try {
    await axios.post(API_URL, { message }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NOTIFY_GATEWAY_TOKEN}`,
      },
    });
    console.log('Notification sent successfully:', message);
  } catch (error) {
    // แสดงข้อผิดพลาดใน console ของ server แต่ไม่หยุดการทำงานของโปรแกรมหลัก
    console.error('Error sending notification:', error.response ? error.response.data : error.message);
  }
};

export default sendNotification;