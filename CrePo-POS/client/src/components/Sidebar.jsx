import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, expandSidebar } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaCashRegister, FaWarehouse, FaUsers, FaChartBar, FaCog, FaSignOutAlt, 
  FaFileInvoiceDollar, FaChevronDown, FaShoppingCart, FaWallet, FaUserTie, FaBook, FaBars, FaCalendarAlt
} from 'react-icons/fa';

// --- โครงสร้างเมนูใหม่ทั้งหมด ---
const navLinks = [
  { to: '/', icon: <FaTachometerAlt />, text: 'ภาพรวม' },
  { to: '/pos', icon: <FaCashRegister />, text: 'ขายหน้าร้าน' },
  { to: '/calendar', icon: <FaCalendarAlt />, text: 'ปฏิทิน' },
  { 
    text: 'ขาย', 
    icon: <FaFileInvoiceDollar />, 
    children: [
      { to: '/quotations', text: 'ใบเสนอราคา' },
      { to: '/invoices', text: 'ใบแจ้งหนี้/ใบกำกับ' },
      { to: '/receipts', text: 'ใบเสร็จรับเงิน' },
    ]
  },
  { 
    text: 'ซื้อ', 
    icon: <FaShoppingCart />, 
    children: [
      { to: '/purchase-orders', text: 'ใบสั่งซื้อ' },
      { to: '/expenses', text: 'บันทึกค่าใช้จ่าย' },
      { to: '/bills', text: 'ใบรับสินค้า' },
    ]
  },
  { 
    text: 'คลังสินค้า', 
    icon: <FaWarehouse />, 
    children: [
      { to: '/inventory', text: 'ภาพรวมคลังสินค้า' },
      { to: '/products', text: 'รายการสินค้า' },
      { to: '/stock-adjustments', text: 'ปรับสต็อก' },
    ]
  },
  { to: '/contacts', icon: <FaUsers />, text: 'ผู้ติดต่อ' },
  { 
    text: 'พนักงาน', 
    icon: <FaUserTie />, 
    children: [
      { to: '/employees', text: 'ข้อมูลพนักงาน' },
      { to: '/payroll', text: 'เงินเดือน' },
    ]
  },
  { 
    text: 'บัญชี', 
    icon: <FaBook />, 
    children: [
      { to: '/chart-of-accounts', text: 'ผังบัญชี' },
      { to: '/journal', text: 'สมุดรายวัน' },
    ]
  },
  { to: '/reports', icon: <FaChartBar />, text: 'รายงาน' },
  { to: '/settings', icon: <FaCog />, text: 'ตั้งค่า' },
];

const NavItem = ({ item, isExpanded }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // ตรวจสอบว่าเมนูย่อยกำลังถูกใช้งานอยู่หรือไม่
  const isChildActive = item.children ? item.children.some(child => location.pathname.startsWith(child.to)) : false;

  useEffect(() => {
    // เปิดเมนูย่อยค้างไว้ถ้ากำลังใช้งานอยู่
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [location.pathname, isChildActive]);

  const handleParentClick = () => {
    if (!isExpanded) {
      dispatch(expandSidebar());
    }
    setIsOpen(!isOpen);
  };
  
  const handleLinkClick = () => {
    if (!isExpanded) {
      dispatch(expandSidebar());
    }
  };

  if (item.children) {
    const isParentActive = isOpen || isChildActive;
    return (
      <li>
        <button
          onClick={handleParentClick}
          className={`flex items-center justify-between w-full h-12 text-sm font-medium transition-colors duration-200 rounded-xl ${isExpanded ? 'px-4' : 'justify-center'} ${isParentActive ? 'text-primary-text bg-primary-light' : 'text-text-secondary hover:bg-gray-100'}`}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center text-xl ${isParentActive ? 'text-primary-dark' : 'text-gray-400'}`}>{item.icon}</div>
            <span className={`ml-2 whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
              {item.text}
            </span>
          </div>
          {isExpanded && <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
        </button>
        {isOpen && isExpanded && (
          <ul className="pl-8 pt-1 mt-1 space-y-1 border-l-2 border-primary-light ml-4">
            {item.children.map((child, index) => <NavItem key={index} item={child} isExpanded={isExpanded} />)}
          </ul>
        )}
      </li>
    );
  }

  const isActive = location.pathname === item.to;
  return (
    <li>
      <Link
        to={item.to}
        onClick={handleLinkClick}
        className={`flex items-center h-12 text-sm font-medium transition-colors duration-200 rounded-xl ${isActive ? 'bg-primary-dark text-white shadow-lg' : 'text-text-secondary hover:bg-gray-100'} ${isExpanded ? 'px-4' : 'justify-center'}`}
      >
        <div className="w-8 h-8 flex items-center justify-center text-xl">{item.icon}</div>
        <span className={`ml-2 whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {item.text}
        </span>
      </Link>
    </li>
  );
};

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarExpanded } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside 
      className={`flex flex-col bg-sidebar-bg border-r border-border-color p-4 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-24'}`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 h-14 px-1">
        <div className={`flex items-center overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'w-full' : 'w-0'}`}>
          <div className="bg-primary-main p-3 rounded-2xl shadow-lg">
            <FaFileInvoiceDollar className="text-white text-xl"/>
          </div>
        </div>
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 text-text-secondary hover:text-primary-text hover:bg-primary-light rounded-lg"
        >
          <FaBars size={20}/>
        </button>
      </div>

      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide -mr-2 pr-2">
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <NavItem key={index} item={link} isExpanded={isSidebarExpanded} />
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Section */}
      <div className="border-t border-border-color pt-3 mt-3">
         <button 
           onClick={onLogout}
           className={`flex items-center w-full h-12 text-sm font-medium transition-colors duration-200 text-text-secondary hover:bg-accent-red/10 hover:text-accent-red rounded-xl ${isSidebarExpanded ? 'px-4' : 'justify-center'}`}
         >
           <div className="w-8 h-8 flex items-center justify-center text-xl"><FaSignOutAlt /></div>
           <span className={`ml-2 whitespace-nowrap transition-opacity duration-200 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
             ออกจากระบบ
           </span>
         </button>
      </div>
    </aside>
  );
}

export default Sidebar;
