import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/product/productSlice';
import { getSales } from '../features/sale/saleSlice';
import { FaArrowUp, FaArrowDown, FaExclamationTriangle, FaFileInvoice, FaDollarSign, FaShoppingCart, FaChartLine, FaWallet } from 'react-icons/fa';

// Card สรุปข้อมูล
const StatCard = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-content-bg p-5 rounded-2xl shadow-main flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
      {change && (
        <div className={`mt-2 flex items-center text-xs ${changeType === 'profit' ? 'text-green-600' : 'text-accent-red'}`}>
          {changeType === 'profit' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          <span>{change}</span>
        </div>
      )}
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { sales, isLoading } = useSelector((state) => state.sales);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getSales());
  }, [dispatch]);

  const dashboardData = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const salesToday = sales.filter(s => new Date(s.createdAt) >= todayStart);
    const salesThisMonth = sales.filter(s => new Date(s.createdAt) >= monthStart);
    
    const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);

    const totalSalesToday = salesToday.reduce((sum, s) => sum + s.total, 0);
    const totalSalesThisMonth = salesThisMonth.reduce((sum, s) => sum + s.total, 0);

    return {
      totalSalesToday,
      totalSalesThisMonth,
      lowStockProducts,
    };
  }, [sales, products]);


  return (
    <div className="animate-fade-in p-2">
      <h1 className="text-3xl font-bold text-primary-text mb-6">ภาพรวมธุรกิจ</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="ยอดขายวันนี้" 
          value={`฿ ${dashboardData.totalSalesToday.toLocaleString()}`}
          icon={<FaDollarSign className="text-white"/>}
          color="bg-accent-green"
        />
        <StatCard 
          title="ยอดขายเดือนนี้" 
          value={`฿ ${dashboardData.totalSalesThisMonth.toLocaleString()}`}
          icon={<FaShoppingCart className="text-white"/>}
          color="bg-accent-sky"
        />
        <StatCard 
          title="กำไรเดือนนี้" 
          value="฿ 0" // Placeholder
          change="-2% จากเดือนก่อน" // Placeholder
          changeType="loss"
          icon={<FaChartLine className="text-white"/>}
          color="bg-accent-yellow"
        />
        <StatCard 
          title="ค่าใช้จ่าย" 
          value="฿ 0" // Placeholder
          icon={<FaWallet className="text-white"/>}
          color="bg-accent-red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-content-bg p-6 rounded-2xl shadow-main">
            <h2 className="text-xl font-semibold text-text-primary mb-4">กราฟยอดขาย (7 วันล่าสุด)</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-text-secondary">Chart will be here</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-content-bg p-6 rounded-2xl shadow-main">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <FaExclamationTriangle className="text-accent-yellow mr-2"/>สินค้าใกล้หมด
            </h2>
            {dashboardData.lowStockProducts.length > 0 ? (
                <ul className="space-y-3 text-sm">
                    {dashboardData.lowStockProducts.slice(0, 5).map(p => (
                         <li key={p._id} className="flex justify-between">
                            <span>{p.name}</span>
                            <span className="font-bold text-accent-red">เหลือ {p.quantity} {p.unit}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-text-secondary">ไม่มีสินค้าใกล้หมด</p>
            )}
          </div>

          <div className="bg-content-bg p-6 rounded-2xl shadow-main">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <FaFileInvoice className="text-accent-sky mr-2"/>สถานะเอกสาร
            </h2>
             <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span>ใบสั่งซื้อรออนุมัติ</span><span className="font-bold">0</span></li>
                <li className="flex justify-between"><span>ใบเสนอราคารอส่ง</span><span className="font-bold">0</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;