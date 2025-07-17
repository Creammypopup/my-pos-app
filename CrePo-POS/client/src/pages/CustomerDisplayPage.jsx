import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';

// Channel สำหรับรับข้อมูลจากหน้า POS หลัก
const channel = new BroadcastChannel('pos_customer_display');

function CustomerDisplayPage() {
    const { settings } = useSelector((state) => state.settings);
    const [cart, setCart] = useState([]);
    const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 });

    useEffect(() => {
        const handleMessage = (event) => {
            const { cart, totals } = event.data;
            setCart(cart);
            setTotals(totals);
        };

        channel.addEventListener('message', handleMessage);

        // Send a ready message to the main window
        channel.postMessage({ status: 'ready' });

        return () => {
            channel.removeEventListener('message', handleMessage);
        };
    }, []);
    
    const promptPayQr = `|00020101021230610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000-00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000_id:5115${totals.total.toFixed(2)}5802TH6304`;

    return (
        <div className="h-screen bg-primary-dark text-white p-8 flex flex-col justify-between">
            <header className="text-center">
                <h1 className="text-4xl font-bold">{settings.storeName || 'ยินดีต้อนรับ'}</h1>
            </header>
            
            <main className="flex-grow my-8 bg-white/10 rounded-2xl p-4">
                <div className="h-full overflow-y-auto">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <div key={item.cartId} className="flex justify-between items-center text-2xl py-3 border-b border-white/20">
                                <span className="flex-grow">{item.name}</span>
                                <span className="w-32 text-center">x{item.qty}</span>
                                <span className="w-48 text-right font-semibold">{(item.price * item.qty).toLocaleString()} ฿</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full text-3xl opacity-50">
                            รอรายการสินค้า...
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-white/10 rounded-2xl p-6">
                 <div className="flex justify-between items-start">
                     <div className="w-2/3 space-y-2 text-3xl">
                        <div className="flex justify-between"><span>ส่วนลด:</span> <span>{totals.discount.toLocaleString()} ฿</span></div>
                        <div className="flex justify-between text-5xl font-bold text-accent-yellow"><span>รวมทั้งสิ้น:</span> <span>{totals.total.toLocaleString()} ฿</span></div>
                    </div>
                     <div className="w-1/3 flex justify-center items-center">
                        {totals.total > 0 && <QRCode value={promptPayQr} size={150} bgColor="#FFFFFF" fgColor="#581C87" />}
                    </div>
                 </div>
            </footer>
        </div>
    );
}

export default CustomerDisplayPage;