import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRoles, createRole, updateRole, deleteRole, reset } from '../../features/role/roleSlice';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { ALL_PERMISSIONS } from '../../permissions';

function RolesPage() {
  const dispatch = useDispatch();
  const { roles, isLoading, isError, message } = useSelector((state) => state.roles);

  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', currentRole: null });
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, roleId: null });

  useEffect(() => {
    dispatch(getRoles());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId]
    );
  };

  const openModal = (mode = 'add', role = null) => {
    setModalState({ isOpen: true, mode, currentRole: role });
    if (mode === 'edit' && role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions);
    } else {
      setRoleName('');
      setSelectedPermissions([]);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add', currentRole: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName) {
      toast.error('กรุณาใส่ชื่อตำแหน่ง');
      return;
    }
    const roleData = { name: roleName, permissions: selectedPermissions };

    if (modalState.mode === 'edit') {
        dispatch(updateRole({ ...roleData, id: modalState.currentRole._id }))
            .unwrap()
            .then(() => toast.success(`อัปเดตตำแหน่ง "${roleName}" สำเร็จ!`))
            .catch((err) => toast.error(err.message || 'เกิดข้อผิดพลาด'));
    } else {
        dispatch(createRole(roleData))
            .unwrap()
            .then(() => toast.success(`สร้างตำแหน่ง "${roleName}" สำเร็จ!`))
            .catch((err) => toast.error(err.message || 'เกิดข้อผิดพลาด'));
    }
    closeModal();
  };

  const handleDelete = (roleId) => {
    dispatch(deleteRole(roleId))
        .unwrap()
        .then(() => toast.success('ลบตำแหน่งเรียบร้อยแล้ว'))
        .catch((err) => toast.error(err.message || 'เกิดข้อผิดพลาด'));
    setDeleteConfirm({ isOpen: false, roleId: null });
  };

  if (isLoading && roles.length === 0) {
    return <p>กำลังโหลดข้อมูลตำแหน่ง...</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">ตำแหน่งและสิทธิ์</h1>
        <button onClick={() => openModal('add')} className="bg-primary-dark hover:bg-primary-main text-white font-bold py-2 px-4 rounded-xl flex items-center transition-all duration-300 shadow-lg">
          <FaPlus className="mr-2" /> สร้างตำแหน่งใหม่
        </button>
      </div>

      <div className="bg-content-bg p-6 rounded-2xl shadow-main">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">รายการตำแหน่งทั้งหมด</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border-color">
                <th className="p-3 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">ชื่อตำแหน่ง</th>
                <th className="p-3 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">จำนวนสิทธิ์</th>
                <th className="p-3 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role._id} className="border-b border-border-color hover:bg-gray-50">
                  <td className="p-4 font-medium text-text-primary">{role.name}</td>
                  <td className="p-4 text-text-secondary">{role.permissions.length}</td>
                  <td className="p-4 flex space-x-2">
                    <button onClick={() => openModal('edit', role)} className="text-accent-sky bg-accent-sky/10 p-2 rounded-full hover:bg-accent-sky/20 transition-colors"><FaEdit size={16} /></button>
                    <button onClick={() => setDeleteConfirm({ isOpen: true, roleId: role._id })} className="text-accent-red bg-accent-red/10 p-2 rounded-full hover:bg-accent-red/20 transition-colors"><FaTrash size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalState.isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4 animate-fade-in">
         <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300">
           <h2 className="text-2xl font-bold mb-6 text-text-primary">{modalState.mode === 'add' ? 'สร้างตำแหน่งใหม่' : 'แก้ไขตำแหน่ง'}</h2>
           <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2">
             <div className="mb-6">
               <label className="block text-sm font-bold mb-2 text-text-primary">ชื่อตำแหน่ง</label>
               <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-border-color rounded-xl focus:outline-none focus:border-primary-main transition-colors" placeholder="เช่น พนักงานแคชเชียร์"/>
             </div>
             <div>
               <label className="block text-sm font-bold mb-4 text-text-primary">กำหนดสิทธิ์การเข้าถึง</label>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
                   {ALL_PERMISSIONS.map((permission) => (
                       <label key={permission.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white cursor-pointer">
                           <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-main rounded-md border-gray-300 focus:ring-primary-main transition-colors" checked={selectedPermissions.includes(permission.id)} onChange={() => handlePermissionChange(permission.id)}/>
                           <span className="text-text-primary select-none">{permission.name}</span>
                       </label>
                   ))}
               </div>
             </div>
           </form>
            <div className="flex items-center justify-end mt-8 pt-6 border-t border-border-color">
               <button type="button" onClick={closeModal} className="text-text-secondary font-bold uppercase px-6 py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors mr-4">ยกเลิก</button>
               <button type="submit" className="bg-primary-dark text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-primary-main focus:outline-none focus:ring-4 focus:ring-primary-light transition-all duration-300">
                 บันทึก
               </button>
             </div>
         </div>
       </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                <h3 className="text-xl font-bold text-text-primary">ยืนยันการลบ</h3>
                <p className="text-text-secondary my-4">คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งนี้? <br/>การกระทำนี้ไม่สามารถย้อนกลับได้</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => setDeleteConfirm({ isOpen: false, roleId: null })} className="px-6 py-2 rounded-lg text-text-secondary bg-gray-200 hover:bg-gray-300 font-semibold">ยกเลิก</button>
                    <button onClick={() => handleDelete(deleteConfirm.roleId)} className="px-6 py-2 rounded-lg text-white bg-accent-red hover:bg-red-600 font-semibold">ยืนยันการลบ</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default RolesPage;
