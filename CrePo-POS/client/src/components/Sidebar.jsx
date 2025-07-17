import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, expandSidebar } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaCashRegister, FaWarehouse, FaUsers, FaChartBar, FaCog, FaSignOutAlt,
  FaFileInvoiceDollar, FaChevronDown, FaShoppingCart, FaWallet, FaUserTie, FaBook, FaBars, FaCalendarAlt, FaHistory, FaFileContract, FaBoxOpen, FaTruckLoading, FaHandHoldingUsd, FaUndo, FaArrowCircleDown, FaArrowCircleUp, FaReceipt, FaFileInvoice, FaMoneyBillWave, FaMoneyCheckAlt, FaClipboardList
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
      { to: '/customer-orders', text: 'ออเดอร์ลูกค้า', permission: 'sales-docs-view', icon: <FaClipboardList /> },
      { to: '/quotations', text: 'ใบเสนอราคา', permission: 'quotations-manage', icon: <FaFileContract /> },
      { to: '/billing-notes', text: 'ใบวางบิล/ใบแจ้งหนี้', permission: 'invoices-manage', icon: <FaFileInvoice /> },
      { to: '/delivery-notes', text: 'ใบส่งของ', permission: 'invoices-manage', icon: <FaTruckLoading /> },
      { to: '/receipts', text: 'ใบเสร็จรับเงิน', permission: 'receipts-manage', icon: <FaReceipt /> },
      { to: '/credit-notes', text: 'ใบลดหนี้/คืนสินค้า', permission: 'invoices-manage', icon: <FaUndo /> },
    ]
  },
  {
    text: 'ซื้อ',
    icon: <FaShoppingCart />,
    permission: 'purchase-docs-view',
    children: [
      { to: '/purchase-orders', text: 'ใบสั่งซื้อ', permission: 'purchase-orders-manage', icon: <FaHandHoldingUsd /> },
      { to: '/expenses', text: 'บันทึกค่าใช้จ่าย', permission: 'expenses-manage', icon: <FaWallet /> },
      { to: '/bills', text: 'ใบรับสินค้า', permission: 'purchase-docs-view', icon: <FaBoxOpen /> },
    ]
  },
  {
    text: 'บัญชี',
    icon: <FaMoneyCheckAlt />,
    permission: 'accounting-view',
    children: [
      { to: '/receivables', text: 'รายการลูกหนี้', permission: 'accounting-view', icon: <FaMoneyBillWave /> },
      { to: '/chart-of-accounts', text: 'ผังบัญชี', permission: 'chart-of-accounts-manage', icon: <FaBook /> },
    ]
  },
  {
    text: 'คลังสินค้า',
    icon: <FaWarehouse />,
    permission: 'products-view',
    children: [
      { to: '/inventory', text: 'ภาพรวมคลังสินค้า', permission: 'stock-adjustments-manage', icon: <FaWarehouse/> },
      { to: '/products', text: 'รายการสินค้า', permission: 'products-view', icon: <FaBoxOpen/> },
      { to: '/stock-transfers-in', text: 'ใบโอนสินค้ารับเข้า', permission: 'stock-adjustments-manage', icon: <FaArrowCircleDown/> },
      { to: '/stock-transfers-out', text: 'ใบโอนสินค้าส่งออก', permission: 'stock-adjustments-manage', icon: <FaArrowCircleUp/> },
    ]
  },
  { to: '/contacts', icon: <FaUsers />, text: 'ผู้ติดต่อ', permission: 'contacts-manage' },
  { to: '/reports', icon: <FaChartBar />, text: 'รายงาน', permission: 'reports-view' },
  { to: '/settings', icon: <FaCog />, text: 'ตั้งค่า', permission: 'settings-access' },
];

const NavItemContent = ({ item, isExpanded }) => (
    <div className={`flex items-center w-full h-full ${isExpanded ? 'pl-4' : 'justify-center'}`}>
        <div className="w-8 h-8 flex items-center justify-center text-xl shrink-0">
            {item.icon}
        </div>
        <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            {item.text}
        </span>
    </div>
);


const NavItem = ({ item, isExpanded, userPermissions }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const hasPermission = item.permission ? userPermissions.includes(item.permission) : true;
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
        <button onClick={handleParentClick} className={`flex items-center justify-between w-full h-12 text-sm font-medium transition-colors duration-200 rounded-xl ${isParentActive ? 'text-primary-text bg-primary-light/80' : 'text-text-secondary hover:bg-white/50'}`}>
           <NavItemContent item={item} isExpanded={isExpanded} />
           {isExpanded && <FaChevronDown className={`transition-transform duration-200 mr-4 ${isOpen ? 'rotate-180' : ''}`} />}
        </button>
        {isOpen && isExpanded && (
          <ul className="pl-12 pt-1 mt-1 space-y-1">
            {visibleChildren.map((child) => (
              <li key={child.to}>
                 <Link to={child.to} className={`flex items-center h-10 text-sm font-medium transition-colors duration-200 rounded-xl px-4 ${location.pathname === child.to ? 'text-primary-dark font-semibold' : 'text-text-secondary hover:bg-white/50'}`}>
                    {child.icon && <span className="mr-3 text-gray-400">{child.icon}</span>}
                    {child.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  const isActive = location.pathname === item.to;
  return (
    <li>
      <Link to={item.to} onClick={handleLinkClick} className={`flex items-center w-full h-12 text-sm font-medium transition-colors duration-200 rounded-xl ${isActive ? 'bg-primary-dark text-white shadow-lg' : 'text-text-secondary hover:bg-white/50'}`}>
        <NavItemContent item={item} isExpanded={isExpanded} />
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
    <aside className={`flex flex-col bg-sidebar-bg border-r border-purple-200/50 p-4 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-24'}`}>
      <div className="flex items-center justify-between mb-6 h-14">
        {isSidebarExpanded && (
          <div className="flex items-center overflow-hidden transition-all duration-300 pl-4">
             <div className="bg-primary-main p-3 rounded-2xl shadow-lg">
                <FaFileInvoiceDollar className="text-white text-xl"/>
             </div>
             <span className="text-xl font-bold text-primary-text ml-3">CrePo-POS</span>
          </div>
        )}
        <button onClick={() => dispatch(toggleSidebar())} className="p-2 text-text-secondary hover:text-primary-text hover:bg-white/50 rounded-lg ml-auto">
          <FaBars size={20}/>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {navLinks.map((link, index) => (
              <NavItem key={index} item={link} isExpanded={isSidebarExpanded} userPermissions={permissions} />
            ))}
          </ul>
      </nav>

      <div className="border-t border-purple-200/80 pt-3 mt-3">
         <button onClick={onLogout} className={`flex items-center w-full h-12 text-sm font-medium transition-colors duration-200 text-text-secondary hover:bg-accent-red/10 hover:text-accent-red rounded-xl`}>
           <NavItemContent item={{icon: <FaSignOutAlt />, text: "ออกจากระบบ"}} isExpanded={isSidebarExpanded} />
         </button>
      </div>
    </aside>
  );
}

export default Sidebar;