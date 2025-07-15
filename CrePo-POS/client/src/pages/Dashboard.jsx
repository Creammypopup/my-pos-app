import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/product/productSlice';
import { getSales } from '../features/sale/saleSlice';
// แก้ไข: เพิ่ม FaInfoCircle เข้าไปใน import
import { FaExclamationTriangle, FaBoxOpen, FaDollarSign, FaShoppingCart, FaChartLine, FaWallet, FaArrowUp, FaInfoCircle } from 'react-icons/fa';

// Card for summary stats
const StatCard = ({ title, value, change, icon, color }) => (
  <div className="bg-content-bg p-5 rounded-2xl shadow-main flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
      {change && (
        <div className="mt-2 flex items-center text-xs text-green-600">
          <FaArrowUp className="mr-1" />
          <span>{change}</span>
        </div>
      )}
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

// Panel for notifications
const NotificationPanel = ({ title, icon, color, items, emptyText }) => (
    <div className="bg-content-bg p-6 rounded-2xl shadow-main">
        <h2 className={`text-xl font-semibold text-text-primary mb-4 flex items-center`}>
            {React.cloneElement(icon, { className: `mr-3 ${color}` })}
            {title}
        </h2>
        {items.length > 0 ? (
            <ul className="space-y-3 text-sm max-h-48 overflow-y-auto">
                {items.map(item => (
                    <li key={item.key} className="flex justify-between">
                        <span>{item.label}</span>
                        <span className={`font-bold ${item.valueColor || 'text-text-primary'}`}>{item.value}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-text-secondary">{emptyText}</p>
        )}
    </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { sales } = useSelector((state) => state.sales);

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
    
    const lowStockProducts = products.filter(p => p.productType === 'standard' && p.quantity > 0 && p.quantity <= p.lowStockThreshold);
    const outOfStockProducts = products.filter(p => p.productType === 'standard' && p.quantity <= 0);

    return {
      totalSalesToday: salesToday.reduce((sum, s) => sum + s.total, 0),
      totalSalesThisMonth: salesThisMonth.reduce((sum, s) => sum + s.total, 0),
      lowStockProducts,
      outOfStockProducts,
    };
  }, [sales, products]);

  return (
    <div className="animate-fade-in p-2 space-y-8">
      {/* Overview Section */}
      <div>
        <h1 className="text-3xl font-bold text-primary-text mb-6">ภาพรวม</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="ยอดขายวันนี้" value={`฿${dashboardData.totalSalesToday.toLocaleString()}`} icon={<FaDollarSign className="text-white"/>} color="bg-accent-green" />
            <StatCard title="ยอดขายเดือนนี้" value={`฿${dashboardData.totalSalesThisMonth.toLocaleString()}`} icon={<FaShoppingCart className="text-white"/>} color="bg-accent-sky" />
            <StatCard title="กำไรวันนี้ (TBD)" value="฿0" icon={<FaChartLine className="text-white"/>} color="bg-accent-yellow" />
            <StatCard title="ต้นทุนคงเหลือ (TBD)" value="฿0" icon={<FaWallet className="text-white"/>} color="bg-accent-pink" />
        </div>
      </div>
      
      {/* Notifications Section */}
      <div>
        <h1 className="text-3xl font-bold text-primary-text mb-6">การแจ้งเตือน</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <NotificationPanel 
                    title="สินค้าใกล้หมด"
                    icon={<FaExclamationTriangle />}
                    color="text-accent-yellow"
                    items={dashboardData.lowStockProducts.map(p => ({ key: p._id, label: p.name, value: `เหลือ ${p.quantity} ${p.units[0]?.name || ''}`, valueColor: 'text-accent-yellow' }))}
                    emptyText="ไม่มีสินค้าใกล้หมด"
                />
            </div>
            <div className="lg:col-span-1">
                 <NotificationPanel 
                    title="สินค้าหมดสต็อก"
                    icon={<FaBoxOpen />}
                    color="text-accent-red"
                    items={dashboardData.outOfStockProducts.map(p => ({ key: p._id, label: p.name, value: 'หมดสต็อก', valueColor: 'text-accent-red' }))}
                    emptyText="ไม่มีสินค้าหมดสต็อก"
                />
            </div>
            <div className="lg:col-span-1">
                {/* Placeholder for other notifications */}
                <NotificationPanel 
                    title="การแจ้งเตือนอื่นๆ"
                    icon={<FaInfoCircle />}
                    color="text-accent-sky"
                    items={[]}
                    emptyText="ไม่มีการแจ้งเตือนอื่นๆ"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;