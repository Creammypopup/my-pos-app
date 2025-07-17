import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateCartQuantity, removeFromCart } from '../../features/cart/cartSlice';
import { FaTrash } from 'react-icons/fa';

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
                        <p className="text-text-secondary">ตะกร้าของคุณว่างเปล่า</p>
                        <Link to="/store" className="mt-4 inline-block bg-primary-main text-white px-6 py-2 rounded-lg">กลับไปเลือกซื้อสินค้า</Link>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-main">
                        {cartItems.map(item => (
                            <div key={item.cartId} className="flex items-center py-4 border-b">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4"></div>
                                <div className="flex-grow">
                                    <h2 className="font-bold">{item.name}</h2>
                                    <p className="text-sm text-text-secondary">{item.unitName}</p>
                                </div>
                                <input type="number" value={item.qty} onChange={(e) => dispatch(updateCartQuantity({cartId: item.cartId, qty: Number(e.target.value)}))} className="w-16 text-center border rounded-lg mx-4" />
                                <p className="w-24 text-right font-semibold">{(item.qty * item.price).toLocaleString()} ฿</p>
                                <button onClick={() => dispatch(removeFromCart(item.cartId))} className="ml-4 text-red-500"><FaTrash /></button>
                            </div>
                        ))}
                        <div className="mt-6 text-right">
                            <p className="text-2xl font-bold">ยอดรวม: <span className="text-primary-dark">{subtotal.toLocaleString()} ฿</span></p>
                            <button onClick={handleCheckout} className="mt-4 bg-primary-dark text-white px-8 py-3 rounded-lg font-bold text-lg">ดำเนินการต่อ</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;