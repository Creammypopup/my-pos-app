import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSales } from '../features/sale/saleSlice';

function SalesHistoryPage() {
    const dispatch = useDispatch();
    const { sales, isLoading } = useSelector((state) => state.sales);

    useEffect(() => {
        dispatch(getSales());
    }, [dispatch]);

    const sortedSales = useMemo(() => {
        return [...sales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [sales]);

    return (
        <div className="p-4 md:p-8 bg-bg-main min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-primary-text mb-6">ประวัติการขาย</h1>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-text-secondary font-semibold">เลขที่ใบเสร็จ</th>
                                    <th className="p-4 text-text-secondary font-semibold">ลูกค้า</th>
                                    <th className="p-4 text-text-secondary font-semibold">วันที่</th>
                                    <th className="p-4 text-text-secondary font-semibold text-right">ยอดรวม</th>
                                    <th className="p-4 text-text-secondary font-semibold text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="5" className="text-center p-8 text-gray-500">กำลังโหลดข้อมูล...</td></tr>
                                ) : sortedSales && sortedSales.length > 0 ? (
                                    sortedSales.map((sale) => (
                                        <tr key={sale._id} className="border-b border-border-color hover:bg-purple-50">
                                            <td className="p-4 text-primary-main font-medium">{sale.receiptNumber}</td>
                                            <td className="p-4 text-gray-700">{sale.customer?.name || 'ลูกค้าทั่วไป'}</td>
                                            <td className="p-4 text-gray-500">{new Date(sale.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                            <td className="p-4 text-right font-semibold">{Number(sale.total).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</td>
                                            <td className="p-4 text-center">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">ชำระแล้ว</span>
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