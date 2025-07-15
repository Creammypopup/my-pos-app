import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaStore, FaUsers, FaUserTag, FaPalette } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function SettingsLayout() {
  const { user } = useSelector((state) => state.auth);

  const settingsMenu = [
    { name: 'ทั่วไป', path: '/settings/general', icon: <FaStore /> },
    { name: 'จัดการผู้ใช้', path: '/settings/users', icon: <FaUsers />, adminOnly: true },
    { name: 'ตำแหน่งและสิทธิ์', path: '/settings/roles', icon: <FaUserTag />, adminOnly: true },
    { name: 'ธีม/สี', path: '/settings/theme', icon: <FaPalette /> },
  ];

  const activeClassName = "bg-brand-light text-brand-primary border-l-4 border-brand-primary";
  const inactiveClassName = "text-text-secondary hover:bg-gray-100";

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      <div className="md:w-1/4 lg:w-1/5">
        <h1 className="text-2xl font-bold text-text-primary mb-6">ตั้งค่าระบบ</h1>
        <nav className="flex flex-col gap-1">
          {settingsMenu.map((item) => {
            if (item.adminOnly && user?.role?.name !== 'Admin') {
              return null;
            }
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-semibold ${isActive ? activeClassName : inactiveClassName}`
                }
              >
                <span className="w-5">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 bg-content-bg p-6 md:p-8 rounded-2xl shadow-main">
        <Outlet /> {/* ส่วนนี้จะแสดงเนื้อหาของแต่ละหน้าย่อย */}
      </div>
    </div>
  );
}

export default SettingsLayout;