import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { getSales } from '../features/sale/saleSlice'; // We will create this function in the future

function SalesHistoryPage() {
    const dispatch = useDispatch();
    // const { sales, isLoading } = useSelector((state) => state.sales);

    useEffect(() => {
        // When we build the backend for this, we will dispatch getSales()
        // dispatch(getSales()); 
    }, [dispatch]);

    // Placeholder data until we build the backend
    const sales = [
        { _id: '1', receiptNumber: 'RE-000001', customer: { name: 'ลูกค้าทั่วไป' }, createdAt: new Date().toISOString(), total: 1500, status: 'ชำระแล้ว' },
        { _id: '2', receiptNumber: 'RE-000002', customer: { name: 'คุณสมหญิง' }, createdAt: new Date().toISOString(), total: 850, status: 'ชำระแล้ว' },
    ];
    const isLoading = false;

    return (
        <div className="p-4 md:p-8 bg-purple-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-purple-800 mb-6">ประวัติการขาย</h1>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-gray-600 font-semibold">เลขที่ใบเสร็จ</th>
                                    <th className="p-4 text-gray-600 font-semibold">ลูกค้า</th>
                                    <th className="p-4 text-gray-600 font-semibold">วันที่</th>
                                    <th className="p-4 text-gray-600 font-semibold text-right">ยอดรวม</th>
                                    <th className="p-4 text-gray-600 font-semibold text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="5" className="text-center p-8">กำลังโหลด...</td></tr>
                                ) : sales && sales.length > 0 ? (
                                    sales.map((sale) => (
                                        <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 text-purple-600 font-medium">{sale.receiptNumber}</td>
                                            <td className="p-4 text-gray-700">{sale.customer?.name || 'ลูกค้าทั่วไป'}</td>
                                            <td className="p-4 text-gray-500">{new Date(sale.createdAt).toLocaleDateString('th-TH')}</td>
                                            <td className="p-4 text-right font-semibold">{Number(sale.total).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</td>
                                            <td className="p-4 text-center">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{sale.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center p-8 text-gray-500">ยังไม่มีประวัติการขาย</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesHistoryPage;
