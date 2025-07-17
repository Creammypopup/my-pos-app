import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSales, addPaymentToSale, reset } from '../../features/sale/saleSlice';
import { FaMoneyBillWave, FaSearch, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Payment Modal Component
const AddPaymentModal = ({ isOpen, onClose, onSave, sale }) => {
    const [amount, setAmount] = useState(sale?.balance || 0);
    const [method, setMethod] = useState('เงินสด');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (sale) {
            setAmount(sale.balance);
            setMethod('เงินสด');
            setNotes('');
        }
    }, [sale]);

    if (!isOpen || !sale) return null;
    
    const handleSave = () => {
        if (amount <= 0 || amount > sale.balance) {
            toast.error(`จำนวนเงินต้องมากกว่า 0 และไม่เกินยอดค้างชำระ (${sale.balance.toLocaleString()} บาท)`);
            return;
        }
        onSave({ amount: Number(amount), method, notes });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">รับชำระเงิน</h2>
                    <button onClick={onClose}><FaTimes /></button>
                </div>
                <p className="text-sm text-gray-500 mb-4">ใบเสร็จเลขที่: <span className="font-semibold text-purple-700">{sale.receiptNumber}</span></p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ยอดค้างชำระ</label>
                        <p className="text-3xl font-bold text-red-600">{sale.balance.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">จำนวนเงินที่ชำระ</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700">ช่องทางการชำระเงิน</label>
                        <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500">
                            <option>เงินสด</option>
                            <option>โอนจ่าย</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">หมายเหตุ</label>
                        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="(ไม่บังคับ)" className="w-full p-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                </div>
                 <div className="flex justify-end space-x-4 pt-6 mt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 shadow-md">บันทึกการชำระเงิน</button>
                </div>
            </div>
        </div>
    );
};

function ReceivablesPage() {
    const dispatch = useDispatch();
    const { sales, isLoading } = useSelector((state) => state.sales);
    
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getSales());
        return () => dispatch(reset());
    }, [dispatch]);

    const unpaidSales = useMemo(() => {
        const filtered = sales.filter(s => s.paymentStatus === 'unpaid' || s.paymentStatus === 'partial');
        if (!searchTerm) return filtered;
        return filtered.filter(s => 
            s.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sales, searchTerm]);

    const handleOpenPaymentModal = (sale) => {
        setSelectedSale(sale);
        setIsPaymentModalOpen(true);
    };
    
    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedSale(null);
    };

    const handleSavePayment = (paymentData) => {
        dispatch(addPaymentToSale({ saleId: selectedSale._id, ...paymentData }))
            .unwrap()
            .then(() => {
                toast.success('บันทึกการชำระเงินสำเร็จ');
                handleClosePaymentModal();
                dispatch(getSales()); // Refresh data
            })
            .catch((err) => toast.error(err.message || 'เกิดข้อผิดพลาด'));
    };
    
    return (
        <>
            <AddPaymentModal isOpen={isPaymentModalOpen} onClose={handleClosePaymentModal} onSave={handleSavePayment} sale={selectedSale} />
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-primary-text">รายการลูกหนี้</h1>
                    <div className="relative">
                        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="ค้นหา (เลขที่, ชื่อลูกค้า)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 pl-10 pr-4 py-2 border rounded-lg" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4">เลขที่ใบเสร็จ</th>
                                    <th className="p-4">ลูกค้า</th>
                                    <th className="p-4 text-right">ยอดทั้งหมด</th>
                                    <th className="p-4 text-right">ยอดค้างชำระ</th>
                                    <th className="p-4">วันครบกำหนด</th>
                                    <th className="p-4 text-center">สถานะ</th>
                                    <th className="p-4 text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="7" className="text-center p-8">กำลังโหลด...</td></tr>
                                ) : unpaidSales.length > 0 ? (
                                    unpaidSales.map(sale => (
                                        <tr key={sale._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium text-purple-600">{sale.receiptNumber}</td>
                                            <td className="p-4">{sale.customer?.name || 'ไม่มีข้อมูล'}</td>
                                            <td className="p-4 text-right">{sale.total.toLocaleString()} ฿</td>
                                            <td className="p-4 text-right font-bold text-red-500">{sale.balance.toLocaleString()} ฿</td>
                                            <td className="p-4">{sale.dueDate ? new Date(sale.dueDate).toLocaleDateString('th-TH') : '-'}</td>
                                            <td className="p-4 text-center">
                                                 <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${sale.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {sale.paymentStatus === 'partial' ? 'ชำระบางส่วน' : 'ค้างชำระ'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleOpenPaymentModal(sale)} className="text-green-500 hover:text-green-700 p-2" title="รับชำระเงิน"><FaMoneyBillWave /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="text-center p-8 text-gray-500">ไม่มีรายการค้างชำระ</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReceivablesPage;