import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, expandSidebar } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaCashRegister, FaWarehouse, FaUsers, FaChartBar, FaCog, FaSignOutAlt,
  FaFileInvoiceDollar, FaChevronDown, FaShoppingCart, FaWallet, FaUserTie, FaBook, FaBars, FaCalendarAlt, FaHistory
} from 'react-icons/fa';

const navLinks = [
  { to: '/', icon: <FaTachometerAlt />, text: 'ภาพรวม', permission: 'dashboard-view' },
  { to: '/pos', icon: <FaCashRegister />, text: 'ขายหน้าร้าน', permission: 'pos-access' },
  { to: '/sales-history', icon: <FaHistory />, text: 'ประวัติการขาย', permission: 'sales-docs-view' },
  { to: '/calendar', icon: <FaCalendarAlt />, text: 'ปฏิทิน' },
  {
    text: 'ขาย',
    icon: <FaFileInvoiceDollar />,
    permission: 'sales-docs-view',
    children: [
      { to: '/quotations', text: 'ใบเสนอราคา', permission: 'quotations-manage' },
      { to: '/invoices', text: 'ใบแจ้งหนี้/ใบกำกับ', permission: 'invoices-manage' },
      { to: '/receipts', text: 'ใบเสร็จรับเงิน', permission: 'receipts-manage' },
    ]
  },
  {
    text: 'ซื้อ',
    icon: <FaShoppingCart />,
    permission: 'purchase-docs-view',
    children: [
      { to: '/purchase-orders', text: 'ใบสั่งซื้อ', permission: 'purchase-orders-manage' },
      { to: '/expenses', text: 'บันทึกค่าใช้จ่าย', permission: 'expenses-manage' },
      { to: '/bills', text: 'ใบรับสินค้า', permission: 'purchase-docs-view' },
    ]
  },
  {
    text: 'คลังสินค้า',
    icon: <FaWarehouse />,
    permission: 'products-view',
    children: [
      { to: '/inventory', text: 'ภาพรวมคลังสินค้า', permission: 'stock-adjustments-manage' },
      { to: '/products', text: 'รายการสินค้า', permission: 'products-view' },
      { to: '/stock-adjustments', text: 'ปรับสต็อก', permission: 'stock-adjustments-manage' },
    ]
  },
  { to: '/contacts', icon: <FaUsers />, text: 'ผู้ติดต่อ', permission: 'contacts-manage' },
  {
    text: 'พนักงาน',
    icon: <FaUserTie />,
    // permission for parent can be a general one
    children: [
      { to: '/employees', text: 'ข้อมูลพนักงาน' },
      { to: '/payroll', text: 'เงินเดือน' },
    ]
  },
  {
    text: 'บัญชี',
    icon: <FaBook />,
    permission: 'accounting-view',
    children: [
      { to: '/chart-of-accounts', text: 'ผังบัญชี', permission: 'chart-of-accounts-manage' },
      { to: '/journal', text: 'สมุดรายวัน', permission: 'journal-manage' },
    ]
  },
  { to: '/reports', icon: <FaChartBar />, text: 'รายงาน', permission: 'reports-view' },
  { to: '/settings', icon: <FaCog />, text: 'ตั้งค่า', permission: 'settings-access' },
];

const NavItem = ({ item, isExpanded, userPermissions }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // Check if user has permission for this item
  const hasPermission = item.permission ? userPermissions.includes(item.permission) : true;
  
  // Filter children based on permissions
  const visibleChildren = item.children?.filter(child => child.permission ? userPermissions.includes(child.permission) : true) || [];

  const isChildActive = item.children ? visibleChildren.some(child => location.pathname.startsWith(child.to)) : false;

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [location.pathname, isChildActive]);

  const handleParentClick = () => {
    if (!isExpanded) dispatch(expandSidebar());
    setIsOpen(!isOpen);
  };
  
  const handleLinkClick = () => {
    if (!isExpanded) dispatch(expandSidebar());
  };

  if (!hasPermission) return null;

  if (item.children && visibleChildren.length > 0) {
    const isParentActive = isOpen || isChildActive;
    return (
      <li>
        <button
          onClick={handleParentClick}
          className={`flex items-center justify-between w-full h-12 text-sm font-medium transition-colors duration-200 rounded-xl ${isExpanded ? 'px-4' : 'justify-center'} ${isParentActive ? 'text-primary-text bg-primary-light/80' : 'text-text-secondary hover:bg-white/50'}`}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center text-xl ${isParentActive ? 'text-primary-dark' : 'text-gray-500'}`}>{item.icon}</div>
            <span className={`ml-3 whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>{item.text}</span>
          </div>
          {isExpanded && <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
        </button>
        {isOpen && isExpanded && (
          <ul className="pl-8 pt-1 mt-1 space-y-1 border-l-2 border-primary-light ml-5">
            {visibleChildren.map((child, index) => <NavItem key={index} item={child} isExpanded={isExpanded} userPermissions={userPermissions} />)}
          </ul>
        )}
      </li>
    );
  }

  const isActive = location.pathname === item.to;
  return (
    <li>
      <Link to={item.to} onClick={handleLinkClick} className={`flex items-center h-12 text-sm font-medium transition-colors duration-200 rounded-xl ${isActive ? 'bg-primary-dark text-white shadow-lg' : 'text-text-secondary hover:bg-white/50'} ${isExpanded ? 'px-4' : 'justify-center'}`}>
        <div className="w-8 h-8 flex items-center justify-center text-xl">{item.icon}</div>
        <span className={`ml-3 whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.text}</span>
      </Link>
    </li>
  );
};

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarExpanded } = useSelector((state) => state.ui);
  const { user, permissions } = useSelector((state) => state.auth);

  if (!user) return null;

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className={`flex flex-col bg-purple-100 border-r border-purple-200/50 p-4 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-24'}`}>
      <div className="flex items-center justify-between mb-6 h-14">
        {isSidebarExpanded && (
          <div className={`flex items-center overflow-hidden transition-all duration-300`}>
             <div className="bg-primary-main p-3 rounded-2xl shadow-lg">
                <FaFileInvoiceDollar className="text-white text-xl"/>
             </div>
          </div>
        )}
        <button onClick={() => dispatch(toggleSidebar())} className="p-2 text-text-secondary hover:text-primary-text hover:bg-white/50 rounded-lg ml-auto">
          <FaBars size={20}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide -mr-2 pr-2">
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <NavItem key={index} item={link} isExpanded={isSidebarExpanded} userPermissions={permissions} />
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-purple-200/80 pt-3 mt-3">
         <button onClick={onLogout} className={`flex items-center w-full h-12 text-sm font-medium transition-colors duration-200 text-text-secondary hover:bg-accent-red/10 hover:text-accent-red rounded-xl ${isSidebarExpanded ? 'px-4' : 'justify-center'}`}>
           <div className="w-8 h-8 flex items-center justify-center text-xl"><FaSignOutAlt /></div>
           <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
             ออกจากระบบ
           </span>
         </button>
      </div>
    </aside>
  );
}

export default Sidebar;