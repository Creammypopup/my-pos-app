import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, createUser, updateUser, deleteUser, reset } from '../../features/user/userSlice';
import { getRoles } from '../../features/role/roleSlice';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const UserModal = ({ isOpen, onClose, onSave, user, setUser, roles }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{user._id ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</h2>
                <form onSubmit={onSave} className="space-y-4">
                    <input name="name" value={user.name || ''} onChange={handleChange} placeholder="ชื่อ-สกุล" required className="w-full px-4 py-2 border rounded-lg" />
                    <input name="username" value={user.username || ''} onChange={handleChange} placeholder="ชื่อผู้ใช้ (สำหรับ Login)" required className="w-full px-4 py-2 border rounded-lg" />
                    <input name="password" type="password" onChange={handleChange} placeholder={user._id ? "กรอกเพื่อเปลี่ยนรหัสผ่าน" : "รหัสผ่าน"} required={!user._id} className="w-full px-4 py-2 border rounded-lg" />
                    
                    <label className="block text-sm font-medium text-gray-700">ตำแหน่ง</label>
                    <select name="role" value={user.role || ''} onChange={(e) => setUser(prev => ({...prev, role: e.target.value}))} className="w-full px-4 py-2 border rounded-lg" required>
                        <option value="" disabled>-- เลือกตำแหน่ง --</option>
                        {roles.map(role => (
                            <option key={role._id} value={role._id}>{role.name}</option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
                        <button type="submit" className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">บันทึก</button>
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
    const { user: loggedInUser } = useSelector((state) => state.auth);

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
    }, [isError, message, dispatch]);

    const openModal = (user = null) => {
        if (user) {
            setCurrentUser({ ...user, role: user.role?._id });
        } else {
            const defaultRole = roles[0] || null;
            setCurrentUser({ role: defaultRole?._id });
        }
        setIsModalOpen(true);
    };

    const handleSave = useCallback((e) => {
        e.preventDefault();
        const userData = { ...currentUser };
        
        const action = currentUser._id ? updateUser(userData) : createUser(userData);

        dispatch(action).unwrap()
            .then(() => {
                toast.success('บันทึกข้อมูลผู้ใช้สำเร็จ!');
                setIsModalOpen(false);
            })
            .catch(err => toast.error(err.message || 'เกิดข้อผิดพลาด'));
    }, [dispatch, currentUser]);

    const handleDelete = (userToDelete) => {
        if (userToDelete._id === loggedInUser._id) {
            toast.error('ไม่สามารถลบบัญชีของตัวเองได้');
            return;
        }
        if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "${userToDelete.name}"?`)) {
            dispatch(deleteUser(userToDelete._id)).unwrap()
                .then(() => toast.success('ลบผู้ใช้สำเร็จ!'))
                .catch(err => toast.error(err.message || 'ไม่สามารถลบผู้ใช้ได้'));
        }
    };

    return (
        <>
            <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} user={currentUser} setUser={setCurrentUser} roles={roles} />
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-primary-text">จัดการผู้ใช้</h1>
                    <button onClick={() => openModal()} className="flex items-center bg-primary-main text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark">
                        <FaPlus className="mr-2" /> เพิ่มผู้ใช้
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4">ชื่อ</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">บทบาท</th>
                                <th className="p-4 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.username}</td>
                                    <td className="p-4">{user.role?.name}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => openModal(user)} className="text-blue-500 p-2"><FaEdit /></button>
                                        <button onClick={() => handleDelete(user)} className="text-red-500 p-2 ml-2" disabled={user._id === loggedInUser._id}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default UsersPage;