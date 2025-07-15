import React from 'react'; // <--- เพิ่มบรรทัดนี้
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaTh, FaBoxOpen, FaHistory, FaFileInvoiceDollar, FaFileContract, FaFileImport, FaDolly, FaAddressBook, FaChartBar, FaCog } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Sidebar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // ถ้ายังไม่ได้ล็อกอิน หรืออยู่ที่หน้า login ให้ซ่อน Sidebar
  if (!user || location.pathname === '/login') {
    return null;
  }

  const navLinks = [
    { to: '/', icon: <FaTachometerAlt className='w-6 h-6' />, text: 'Dashboard' },
    { to: '/pos', icon: <FaTh className='w-6 h-6' />, text: 'POS' },
    { to: '/products', icon: <FaBoxOpen className='w-6 h-6' />, text: 'Products' },
    { to: '/sales', icon: <FaHistory className='w-6 h-6' />, text: 'Sales History' },
    { to: '/expenses', icon: <FaFileInvoiceDollar className='w-6 h-6' />, text: 'Expenses' },
    { to: '/quotations', icon: <FaFileContract className='w-6 h-6' />, text: 'Quotations' },
    { to: '/purchase-orders', icon: <FaFileImport className='w-6 h-6' />, text: 'Purchase Orders' },
    { to: '/stock-adjustments', icon: <FaDolly className='w-6 h-6' />, text: 'Stock Adjustments' },
    { to: '/contacts', icon: <FaAddressBook className='w-6 h-6' />, text: 'Contacts' },
    { to: '/reports', icon: <FaChartBar className='w-6 h-6' />, text: 'Reports' },
    { to: '/settings', icon: <FaCog className='w-6 h-6' />, text: 'Settings' },
  ];

  return (
    <div className='flex flex-col w-64 bg-gray-800'>
      <div className='flex items-center justify-center h-20 shadow-md'>
        <h1 className='text-3xl text-white uppercase'>CrePo-POS</h1>
      </div>
      <ul className='flex flex-col py-4'>
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex flex-row items-center h-12 text-gray-300 transform hover:translate-x-2 transition-transform ease-in duration-200 hover:text-white ${
                location.pathname === link.to ? 'bg-gray-700' : ''
              }`}
            >
              <span className='inline-flex items-center justify-center w-12 h-12 text-lg'>
                {link.icon}
              </span>
              <span className='text-sm font-medium'>{link.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;