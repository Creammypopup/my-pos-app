import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, createUser, updateUser, deleteUser, reset } from '../../features/user/userSlice';
import { getRoles } from '../../features/role/roleSlice';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserModal = ({ isOpen, onClose, onSave, user, setUser, roles, isLoading }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'role') {
        const selectedRole = roles.find(r => r._id === value);
        setUser(prev => ({ ...prev, role: selectedRole }));
      } else {
        setUser(prev => ({ ...prev, [name]: value }));
      }
    };
    
    // Find the role ID for the select value. It could be an object or just an ID string.
    const roleValue = user.role?._id || user.role || '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 text-text-primary">{user._id ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</h2>
                <form onSubmit={onSave} className="space-y-4">
                    <input name="name" value={user.name || ''} onChange={handleChange} placeholder="ชื่อ-สกุล" required className="w-full px-4 py-3 border border-border-color rounded-xl focus:ring-primary-main focus:border-primary-main" />
                    <input name="username" value={user.username || ''} onChange={handleChange} placeholder="ชื่อผู้ใช้ (สำหรับ Login)" required className="w-full px-4 py-3 border border-border-color rounded-xl focus:ring-primary-main focus:border-primary-main" />
                    <input name="email" value={user.email || ''} type="email" onChange={handleChange} placeholder="อีเมล" required className="w-full px-4 py-3 border border-border-color rounded-xl focus:ring-primary-main focus:border-primary-main" />
                    <input name="password" type="password" onChange={handleChange} placeholder={user._id ? "กรอกเพื่อเปลี่ยนรหัสผ่าน" : "รหัสผ่าน"} required={!user._id} className="w-full px-4 py-3 border border-border-color rounded-xl focus:ring-primary-main focus:border-primary-main" />
                    
                    <select name="role" value={roleValue} onChange={handleChange} className="w-full px-4 py-3 border border-border-color rounded-xl focus:ring-primary-main focus:border-primary-main">
                        <option value="">-- เลือกตำแหน่ง --</option>
                        {roles.map(role => (
                            <option key={role._id} value={role._id}>{role.name}</option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 font-semibold transition-colors">ยกเลิก</button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-main font-semibold transition-colors disabled:bg-gray-400">
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function UsersPage() {
    const dispatch = useDispatch();
    const { users, isLoading, isError, message } = useSelector((state) => state.users);
    const { roles } = useSelector((state) => state.roles);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getRoles()); 
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [dispatch, isError, message]);

    const handleSave = (e) => {
        e.preventDefault();
        
        // Convert role object back to just the name for the backend
        const userData = {
            ...currentUser,
            role: currentUser.role.name
        };

        if (currentUser._id) {
            dispatch(updateUser(userData)).unwrap().then(() => {
                toast.success('อัปเดตผู้ใช้สำเร็จ!');
                setIsModalOpen(false);
            }).catch(err => toast.error(err.message || 'ไม่สามารถอัปเดตผู้ใช้ได้'));
        } else {
            dispatch(createUser(userData)).unwrap().then(() => {
                toast.success('เพิ่มผู้ใช้สำเร็จ!');
                setIsModalOpen(false);
            }).catch(err => toast.error(err.message || 'ไม่สามารถเพิ่มผู้ใช้ได้'));
        }
    };
    
    const openModalForEdit = (user) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const openModalForCreate = () => {
        // Find the default role, e.g., 'Sales', or the first one
        const defaultRole = roles.find(r => r.name === 'Sales') || roles[0];
        setCurrentUser({ role: defaultRole });
        setIsModalOpen(true);
    };


    const handleDelete = (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
            dispatch(deleteUser(id)).unwrap().then(() => {
                toast.success('ลบผู้ใช้สำเร็จ!');
            }).catch(err => toast.error(err.message || 'ไม่สามารถลบผู้ใช้ได้'));
        }
    };

    return (
        <div className="animate-fade-in">
            <UserModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onSave={handleSave} 
              user={currentUser} 
              setUser={setCurrentUser} 
              roles={roles} 
              isLoading={isLoading}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary">จัดการผู้ใช้</h1>
                <button onClick={openModalForCreate} className="flex items-center bg-primary-dark text-white px-4 py-2 rounded-xl shadow-lg hover:bg-primary-main transition-colors">
                    <FaPlus className="mr-2" /> เพิ่มผู้ใช้
                </button>
            </div>
            <div className="bg-content-bg rounded-2xl shadow-main overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b-2 border-border-color">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-text-secondary uppercase">ชื่อ</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary uppercase">Username</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary uppercase">อีเมล</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary uppercase">บทบาท</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary uppercase text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b border-border-color last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-text-primary">{user.name}</td>
                                    <td className="p-4 text-text-secondary">{user.username}</td>
                                    <td className="p-4 text-text-secondary">{user.email}</td>
                                    <td className="p-4">
                                      <span className="px-2 py-1 text-xs font-semibold text-primary-text bg-primary-light rounded-full">{user.role?.name || 'N/A'}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => openModalForEdit(user)} className="text-accent-sky hover:text-blue-700 p-2" title="แก้ไข"><FaEdit /></button>
                                        <button onClick={() => handleDelete(user._id)} className="text-accent-red hover:text-red-700 p-2 ml-2" title="ลบ"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UsersPage;