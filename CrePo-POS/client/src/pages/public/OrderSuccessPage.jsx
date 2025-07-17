import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage = () => {
    return (
        <div className="bg-bg-main min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-main text-center max-w-lg">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-primary-text">ส่งคำสั่งซื้อสำเร็จ!</h1>
                <p className="text-text-secondary mt-2">เราได้รับคำสั่งซื้อของคุณแล้ว<br/>เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันยอดรวมและค่าจัดส่ง (ถ้ามี) โดยเร็วที่สุด</p>
                <Link to="/store" className="mt-6 inline-block bg-primary-main text-white px-8 py-3 rounded-lg font-bold">กลับไปหน้าร้านค้า</Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;