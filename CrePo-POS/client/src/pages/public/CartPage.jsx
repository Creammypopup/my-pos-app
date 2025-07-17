import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateCartQuantity, removeFromCart } from '../../features/cart/cartSlice';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="bg-bg-main min-h-screen p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-primary-text mb-6">ตะกร้าสินค้า</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center bg-white p-8 rounded-2xl shadow-main">
                        <p className="text-text-secondary text-lg">ตะกร้าของคุณว่างเปล่า</p>
                        <Link to="/store" className="mt-4 inline-flex items-center gap-2 bg-primary-main text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
                           <FaArrowLeft/> กลับไปเลือกซื้อสินค้า
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-main">
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.cartId} className="flex items-center py-4 border-b">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 flex items-center justify-center text-2xl text-purple-300 font-bold">{item.name.charAt(0)}</div>
                                    <div className="flex-grow">
                                        <h2 className="font-bold text-lg">{item.name}</h2>
                                        <p className="text-sm text-text-secondary">{item.unitName} - {item.price.toLocaleString()} ฿</p>
                                    </div>
                                    <input type="number" min="1" value={item.qty} onChange={(e) => dispatch(updateCartQuantity({cartId: item.cartId, qty: Number(e.target.value)}))} className="w-16 text-center border rounded-lg mx-4 py-1" />
                                    <p className="w-24 text-right font-semibold text-lg">{(item.qty * item.price).toLocaleString()} ฿</p>
                                    <button onClick={() => dispatch(removeFromCart(item.cartId))} className="ml-4 text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-right space-y-4">
                            <p className="text-2xl font-bold">ยอดรวม (ยังไม่รวมค่าส่ง): <span className="text-primary-dark">{subtotal.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span></p>
                            <button onClick={handleCheckout} className="bg-primary-dark text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-text shadow-lg">ดำเนินการต่อ</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;