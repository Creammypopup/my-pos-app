import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../features/cart/cartSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [shippingAddress, setShippingAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleInputChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            customerInfo,
            items: cartItems.map(({ cartId, image, ...rest }) => rest),
            productTotal: subtotal,
            finalTotal: subtotal,
            deliveryMethod,
            shippingAddress: deliveryMethod === 'delivery' ? shippingAddress : '',
        };

        try {
            await axios.post('/api/public/orders', orderData);
            dispatch(clearCart());
            navigate('/order-success');
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ');
            setLoading(false);
        }
    };


    return (
        <div className="bg-bg-main min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-primary-text mb-6">กรอกข้อมูลและยืนยันการสั่งซื้อ</h1>
                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div className="bg-white p-6 rounded-2xl shadow-main space-y-4">
                        <h2 className="text-xl font-bold mb-4">1. ข้อมูลผู้สั่งซื้อ</h2>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">ชื่อ-สกุล</label>
                            <input type="text" name="name" value={customerInfo.name} onChange={handleInputChange} required className="w-full p-2 border rounded-lg mt-1"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary">เบอร์โทรศัพท์</label>
                            <input type="tel" name="phone" value={customerInfo.phone} onChange={handleInputChange} required className="w-full p-2 border rounded-lg mt-1"/>
                        </div>

                        <h2 className="text-xl font-bold mb-2 pt-4">2. วิธีการรับสินค้า</h2>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 border rounded-lg">
                                <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={(e) => setDeliveryMethod(e.target.value)} className="form-radio h-5 w-5 text-primary-main"/>
                                <span className="ml-3">รับเองที่ร้าน</span>
                            </label>
                             <label className="flex items-center p-3 border rounded-lg">
                                <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === 'delivery'} onChange={(e) => setDeliveryMethod(e.target.value)} className="form-radio h-5 w-5 text-primary-main"/>
                                <span className="ml-3">ให้จัดส่ง</span>
                            </label>
                        </div>
                        {deliveryMethod === 'delivery' && (
                             <div className="mt-4">
                                <label className="block text-sm font-medium text-text-secondary">ที่อยู่สำหรับจัดส่ง</label>
                                <textarea name="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required rows="4" className="w-full p-2 border rounded-lg mt-1"></textarea>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-main">
                        <h2 className="text-xl font-bold mb-4">3. สรุปรายการ</h2>
                        <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                             {cartItems.map(item => (
                                <div key={item.cartId} className="flex justify-between items-center text-sm">
                                    <span>{item.name} x {item.qty}</span>
                                    <span className="font-semibold">{(item.qty * item.price).toLocaleString()} ฿</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                             <p className="text-xl font-bold flex justify-between">ยอดรวม (ไม่รวมค่าส่ง): <span className="text-primary-dark">{subtotal.toLocaleString()} ฿</span></p>
                             <p className="text-xs text-text-secondary mt-2">*ค่าจัดส่งจะถูกแจ้งให้ทราบอีกครั้งหลังเจ้าหน้าที่ยืนยันออเดอร์</p>
                        </div>
                        <button type="submit" disabled={loading || cartItems.length === 0} className="w-full mt-4 bg-primary-dark text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-text shadow-lg disabled:bg-gray-400">
                            {loading ? 'กำลังส่งคำสั่งซื้อ...' : 'ยืนยันคำสั่งซื้อ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;