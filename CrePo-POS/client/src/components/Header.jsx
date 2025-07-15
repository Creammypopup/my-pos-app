import React, { useState } from 'react'; // <--- แก้ไขบรรทัดนี้
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  // ไม่แสดง Header ในหน้า Login
  if (!user || location.pathname === '/login') {
    return null;
  }

  return (
    <header className='flex items-center justify-end w-full p-4 bg-white shadow-md'>
      <div className='relative'>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className='flex items-center space-x-2'
        >
          <FaUserCircle className='w-8 h-8 text-gray-600' />
          <span className='text-gray-700'>{user.name}</span>
        </button>
        {dropdownOpen && (
          <div className='absolute right-0 w-48 mt-2 bg-white rounded-md shadow-xl z-10'>
            <a
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
              โปรไฟล์
            </a>
            <button
              onClick={onLogout}
              className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100'
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;