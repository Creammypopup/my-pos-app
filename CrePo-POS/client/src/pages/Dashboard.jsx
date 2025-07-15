import React from 'react';
import { FaArrowUp, FaArrowDown, FaExclamationTriangle, FaFileInvoice, FaDollarSign, FaShoppingCart, FaChartLine, FaWallet } from 'react-icons/fa';

// Card สรุปข้อมูล
const StatCard = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-content-bg p-5 rounded-2xl shadow-main flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
      {change && (
        <div className={`mt-2 flex items-center text-xs ${changeType === 'profit' ? 'text-accent-green' : 'text-accent-red'}`}>
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
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <h1 className="text-3xl font-bold text-brand-dark mb-6">ภาพรวมธุรกิจ</h1>

      {/* Sales and Profit Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="ยอดขายวันนี้" 
          value="฿ 1,250" 
          change="+15% จากเมื่อวาน" 
          changeType="profit" 
          icon={<FaDollarSign className="text-white"/>}
          color="bg-accent-green"
        />
        <StatCard 
          title="ยอดขายเดือนนี้" 
          value="฿ 35,700" 
          change="+8% จากเดือนก่อน" 
          changeType="profit"
          icon={<FaShoppingCart className="text-white"/>}
          color="bg-sky-500"
        />
        <StatCard 
          title="กำไรเดือนนี้" 
          value="฿ 12,300" 
          change="-2% จากเดือนก่อน" 
          changeType="loss"
          icon={<FaChartLine className="text-white"/>}
          color="bg-amber-500"
        />
        <StatCard 
          title="ค่าใช้จ่าย" 
          value="฿ 8,500"
          icon={<FaWallet className="text-white"/>}
          color="bg-accent-red"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sales Chart (Placeholder) */}
          <div className="bg-content-bg p-6 rounded-2xl shadow-main">
            <h2 className="text-xl font-semibold text-text-primary mb-4">กราฟยอดขาย (7 วันล่าสุด)</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-text-secondary">Chart will be here</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Low Stock */}
          <div className="bg-content-bg p-6 rounded-2xl shadow-main">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <FaExclamationTriangle className="text-accent-yellow mr-2"/>สินค้าใกล้หมด
            </h2>
            <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span>ครีมกันแดด</span><span className="font-bold text-accent-red">เหลือ 3 ชิ้น</span></li>
                <li className="flex justify-between"><span>เซรั่มวิตซี</span><span className="font-bold text-accent-red">เหลือ 5 ชิ้น</span></li>
                 <li className="flex justify-between"><span>ลิปสติก</span><span className="font-bold text-accent-yellow">เหลือ 12 ชิ้น</span></li>
            </ul>
          </div>

          {/* Pending Status */}
          <div className="bg-content-bg p-6 rounded-2xl shadow-main">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <FaFileInvoice className="text-sky-500 mr-2"/>สถานะเอกสาร
            </h2>
             <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span>ใบสั่งซื้อรออนุมัติ</span><span className="font-bold">2</span></li>
                <li className="flex justify-between"><span>ใบเสนอราคารอส่ง</span><span className="font-bold">5</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
