import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomerOrders, updateCustomerOrder } from '../features/customerOrder/customerOrderSlice';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';

// Order Detail Modal
const OrderDetailModal = ({ isOpen, onClose, order, onConfirm }) => {
    const [deliveryFee, setDeliveryFee] = useState(0);

    useEffect(() => {
        if(order) {
            setDeliveryFee(order.deliveryFee || 0);
        }
    }, [order]);
    
    if (!isOpen || !order) return null;
    
    const handleConfirm = () => {
        onConfirm({
            id: order._id,
            deliveryFee: Number(deliveryFee),
            orderStatus: 'confirmed'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold">ออเดอร์ #{order.orderNumber}</h2>
                {/* ... Display order details ... */}
                <div className="mt-4">
                    <label>ค่าจัดส่ง:</label>
                    <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose}>ปิด</button>
                    <button onClick={handleConfirm} className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg">ยืนยันออเดอร์</button>
                </div>
            </div>
        </div>
    );
};


function CustomerOrdersPage() {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector(state => state.customerOrders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(getCustomerOrders());
    }, [dispatch]);
    
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleConfirmOrder = (updateData) => {
        dispatch(updateCustomerOrder(updateData))
            .unwrap()
            .then(() => {
                toast.success('ยืนยันออเดอร์เรียบร้อย');
                setIsModalOpen(false);
            })
            .catch(err => toast.error(err.message));
    };

  return (
    <>
        <OrderDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} order={selectedOrder} onConfirm={handleConfirmOrder} />
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-primary-text mb-6">ออเดอร์จากลูกค้า</h1>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    {/* ... Table Header ... */}
                    <tbody>
                        {orders.map(order => (
                             <tr key={order._id}>
                                 {/* ... Table Data ... */}
                                 <td><button onClick={() => handleViewOrder(order)}><FaEye/></button></td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
  );
}

export default CustomerOrdersPage;