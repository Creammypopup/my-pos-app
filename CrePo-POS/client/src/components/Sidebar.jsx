import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../features/ui/uiSlice';
import { 
  FaTachometerAlt, FaTh, FaBoxOpen, FaHistory, FaFileInvoiceDollar, 
  FaAddressBook, FaChartBar, FaCog, FaChevronLeft, FaSignOutAlt 
} from 'react-icons/fa';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const SidebarLink = ({ to, icon, text, isExpanded, isActive }) => (
  <li>
    <Link
      to={to}
      className={`
        flex items-center h-12 text-sm font-semibold transition-colors duration-200
        ${isActive 
          ? 'bg-brand-primary text-white' 
          : 'text-violet-100 hover:bg-brand-dark/50'
        }
        ${isExpanded ? 'px-4 rounded-lg' : 'justify-center rounded-full'}
      `}
    >
      <span className="w-6 h-6">{icon}</span>
      <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
        {text}
      </span>
    </Link>
  </li>
);

function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarExpanded } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { to: '/', icon: <FaTachometerAlt />, text: 'ภาพรวม' },
    { to: '/pos', icon: <FaTh />, text: 'ขายหน้าร้าน (POS)' },
    { to: '/products', icon: <FaBoxOpen />, text: 'สินค้า' },
    { to: '/sales', icon: <FaHistory />, text: 'ประวัติการขาย' },
    { to: '/contacts', icon: <FaAddressBook />, text: 'ผู้ติดต่อ' },
    { to: '/reports', icon: <FaChartBar />, text: 'รายงาน' },
    { to: '/settings', icon: <FaCog />, text: 'ตั้งค่า' },
  ];

  return (
    <div 
      className={`
        flex flex-col bg-brand-dark text-white p-4 transition-all duration-300 ease-in-out
        ${isSidebarExpanded ? 'w-64' : 'w-20'}
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center mb-8 h-12" >
        <div className="bg-white/20 p-2 rounded-lg">
           <FaFileInvoiceDollar className="text-white text-2xl"/>
        </div>
        <h1 className={`ml-3 text-xl font-bold whitespace-nowrap transition-opacity duration-200 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
          CrePo-POS
        </h1>
      </div>

      {/* Menu Section */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <SidebarLink 
              key={link.to}
              to={link.to}
              icon={link.icon}
              text={link.text}
              isExpanded={isSidebarExpanded}
              isActive={location.pathname === link.to}
            />
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div>
         <button 
           onClick={onLogout}
           className={`
             flex items-center w-full h-12 text-sm font-semibold transition-colors duration-200 text-violet-100 hover:bg-red-500/80
             ${isExpanded ? 'px-4 rounded-lg' : 'justify-center rounded-full'}
           `}
         >
           <FaSignOutAlt />
           <span className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
             ออกจากระบบ
           </span>
         </button>
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="w-full mt-2 h-10 flex items-center justify-center text-violet-200 hover:bg-white/10 rounded-lg"
        >
          <FaChevronLeft className={`transition-transform duration-300 ${isSidebarExpanded ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
