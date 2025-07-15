import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { getSettings } from '../features/setting/settingSlice';
import { FaUserCircle, FaBell } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { settings, isLoading } = useSelector((state) => state.settings);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getSettings());
    }
  }, [dispatch, user]);

  const onLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <header className='flex items-center justify-between w-full p-4 bg-content-bg border-b border-border-color'>
      <h1 className='text-xl font-semibold text-text-primary'>
        {isLoading ? '...' : (settings?.storeName || 'ยินดีต้อนรับ')}
      </h1>

      <div className="flex items-center gap-4">
        <button className="text-text-secondary hover:text-primary-main">
          <FaBell size={20} />
        </button>
        <div className='relative'>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='flex items-center gap-2'
          >
            <FaUserCircle size={24} className='text-text-secondary' />
            <span className='text-text-primary font-semibold hidden md:block'>{user.name}</span>
          </button>
          {dropdownOpen && (
            <div className='absolute right-0 w-48 mt-2 bg-white rounded-xl shadow-lifted z-10 overflow-hidden animate-fade-in-fast'>
              <a href='#' className='block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100'>
                โปรไฟล์
              </a>
              <button
                onClick={onLogout}
                className='block w-full px-4 py-2 text-sm text-left text-text-secondary hover:bg-gray-100'
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;