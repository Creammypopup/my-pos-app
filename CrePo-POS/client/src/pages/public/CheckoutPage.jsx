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
            items: cartItems.map(({ cartId, image, ...rest }) => rest), // Remove client-side fields
            productTotal: subtotal,
            finalTotal: subtotal, // Initial total before delivery fee
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
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-primary-text mb-6">ยืนยันการสั่งซื้อ</h1>
                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-main">
                        <h2 className="text-xl font-bold mb-4">ข้อมูลผู้สั่งซื้อ</h2>
                        {/* ... Input fields for name, phone, deliveryMethod, shippingAddress ... */}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-main">
                        <h2 className="text-xl font-bold mb-4">สรุปรายการ</h2>
                         {/* ... Display cart items and subtotal ... */}
                        <button type="submit" disabled={loading || cartItems.length === 0} className="w-full mt-4 bg-primary-dark text-white py-3 rounded-lg font-bold">
                            {loading ? 'กำลังส่ง...' : 'ยืนยันคำสั่งซื้อ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;