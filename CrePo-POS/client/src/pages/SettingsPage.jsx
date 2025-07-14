import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaStore, FaUsers, FaPalette, FaCashRegister } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function SettingsPage() {
    const { user } = useSelector((state) => state.auth);

    const settingsMenu = [
        { name: 'ทั่วไป', path: '/settings/general', icon: <FaStore /> },
        { name: 'จัดการผู้ใช้', path: '/settings/users', icon: <FaUsers />, adminOnly: true },
        { name: 'ตำแหน่ง/สาขา', path: '/settings/locations', icon: <FaCashRegister /> },
        { name: 'ธีม/สี', path: '/settings/theme', icon: <FaPalette /> },
    ];

    const activeStyle = {
        backgroundColor: '#EDE9FE', // purple-100
        borderColor: '#A78BFA', // purple-400
        color: '#5B21B6', // purple-800
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-8">ตั้งค่าระบบ</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {settingsMenu.map((item) => {
                    if (item.adminOnly && user.role !== 'Admin') {
                        return null;
                    }
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            style={({ isActive }) => (isActive ? activeStyle : undefined)}
                            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg hover:border-purple-400 border-2 border-transparent transition-all flex flex-col items-center justify-center text-center"
                        >
                            <div className="text-4xl text-purple-500 mb-3">{item.icon}</div>
                            <h2 className="text-lg font-semibold text-gray-700">{item.name}</h2>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}

export default SettingsPage;
