import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, createUser, deleteUser, reset } from '../../features/user/userSlice';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserModal = ({ isOpen, onClose, onSave, user, setUser }) => {
    if (!isOpen) return null;
    const handleChange = (e) => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{user._id ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</h2>
                <form onSubmit={onSave} className="space-y-4">
                    <input name="name" value={user.name || ''} onChange={handleChange} placeholder="ชื่อ-สกุล" required className="w-full px-4 py-2 border rounded-lg" />
                    <input name="username" value={user.username || ''} onChange={handleChange} placeholder="ชื่อผู้ใช้ (สำหรับ Login)" required className="w-full px-4 py-2 border rounded-lg" />
                    <input name="password" type="password" onChange={handleChange} placeholder={user._id ? "กรอกเพื่อเปลี่ยนรหัสผ่าน" : "รหัสผ่าน"} required={!user._id} className="w-full px-4 py-2 border rounded-lg" />
                    <select name="role" value={user.role || 'Employee'} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                        <option value="Employee">พนักงาน</option>
                        <option value="Admin">แอดมิน</option>
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        dispatch(getUsers());
    }, [dispatch, isError, message]);

    const handleSave = (e) => {
        e.preventDefault();
        // Here you would dispatch updateUser if currentUser has an _id
        dispatch(createUser(currentUser)).unwrap().then(() => {
            toast.success('เพิ่มผู้ใช้สำเร็จ!');
            setIsModalOpen(false);
            dispatch(getUsers());
        }).catch(err => toast.error(err.message || 'ไม่สามารถเพิ่มผู้ใช้ได้'));
    };

    const handleDelete = (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
            dispatch(deleteUser(id)).unwrap().then(() => {
                toast.success('ลบผู้ใช้สำเร็จ!');
                dispatch(getUsers());
            }).catch(err => toast.error(err.message || 'ไม่สามารถลบผู้ใช้ได้'));
        }
    };

    return (
        <>
            <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} user={currentUser} setUser={setCurrentUser} />
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-purple-800">จัดการผู้ใช้</h1>
                    <button onClick={() => { setCurrentUser({ role: 'Employee' }); setIsModalOpen(true); }} className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600">
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
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4 text-center">
                                        <button className="text-blue-500 p-2"><FaEdit /></button>
                                        <button onClick={() => handleDelete(user._id)} className="text-red-500 p-2 ml-2"><FaTrash /></button>
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
