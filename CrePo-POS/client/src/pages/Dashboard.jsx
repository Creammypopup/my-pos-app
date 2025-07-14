import React from 'react';
import { FaArrowUp, FaArrowDown, FaExclamationTriangle, FaFileInvoice, FaBell } from 'react-icons/fa';

const StatCard = ({ title, value, change, changeType, children }) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex flex-col justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    {change && (
      <div className={`mt-2 flex items-center text-sm ${changeType === 'profit' ? 'text-green-500' : 'text-red-500'}`}>
        {changeType === 'profit' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
        <span>{change}</span>
      </div>
    )}
    {children}
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">ภาพรวมธุรกิจ</h1>

      {/* Sales and Profit Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="ยอดขายวันนี้" value="฿ 1,250.00" change="กำไร ฿ 450.00" changeType="profit" />
        <StatCard title="ยอดขายเดือนนี้" value="฿ 35,700.00" change="กำไร ฿ 12,300.00" changeType="profit" />
        <StatCard title="ยอดขายปีนี้" value="฿ 450,200.00" change="กำไร ฿ 180,500.00" changeType="profit" />
        <StatCard title="ทุนคงเหลือ" value="฿ 85,000.00" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Expenses */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">สรุปค่าใช้จ่าย</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">ค่าเช่า</p>
                <p className="font-semibold text-red-600">฿ 15,000.00</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">เงินเดือน</p>
                <p className="font-semibold text-red-600">฿ 30,000.00</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">ค่าการตลาด</p>
                <p className="font-semibold text-red-600">฿ 5,000.00</p>
              </div>
              <hr/>
              <div className="flex justify-between items-center text-lg">
                <p className="font-bold text-gray-800">รวม (เดือนนี้)</p>
                <p className="font-bold text-red-700">฿ 50,000.00</p>
              </div>
            </div>
          </div>
          
          {/* Debtors & Creditors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">ลูกหนี้ (ใกล้ถึง/เลยกำหนด)</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between text-red-600"><span>บจก. ตัวอย่าง</span><span>฿ 5,400.00</span></li>
                <li className="flex justify-between text-yellow-600"><span>คุณสมชาย</span><span>฿ 1,200.00</span></li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">เจ้าหนี้ (ใกล้ถึง/เลยกำหนด)</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between text-blue-600"><span>บจก. ผู้ผลิต</span><span>฿ 25,000.00</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Low Stock */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FaExclamationTriangle className="text-yellow-500 mr-2"/>สินค้าใกล้หมด</h2>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>ครีมกันแดด</span><span className="font-bold">3 ชิ้น</span></li>
                <li className="flex justify-between"><span>เซรั่มวิตซี</span><span className="font-bold">5 ชิ้น</span></li>
            </ul>
          </div>

          {/* Pending Status */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FaFileInvoice className="text-blue-500 mr-2"/>สถานะเอกสาร</h2>
             <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>รออนุมัติ</span><span className="font-bold">2 รายการ</span></li>
                <li className="flex justify-between"><span>รอจัดส่ง</span><span className="font-bold">5 รายการ</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
