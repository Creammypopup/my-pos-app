import React from 'react';

const ContactModal = ({ isOpen, onClose, onSave, contact, setContact }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl m-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{contact._id ? 'แก้ไขข้อมูลผู้ติดต่อ' : 'เพิ่มผู้ติดต่อใหม่'}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={contact.name || ''} onChange={handleChange} placeholder="ชื่อ-สกุล / ชื่อบริษัท" className="w-full px-4 py-2 border rounded-lg" required />
            <select name="contactType" value={contact.contactType || 'customer'} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="customer">ลูกค้า</option>
              <option value="supplier">ผู้จัดจำหน่าย</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="taxId" value={contact.taxId || ''} onChange={handleChange} placeholder="เลขประจำตัวผู้เสียภาษี" className="w-full px-4 py-2 border rounded-lg" />
            <input name="branch" value={contact.branch || ''} onChange={handleChange} placeholder="รหัสสาขา (เช่น 00000)" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <textarea name="address" value={contact.address || ''} onChange={handleChange} placeholder="ที่อยู่" rows="3" className="w-full px-4 py-2 border rounded-lg"></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="phone" value={contact.phone || ''} onChange={handleChange} placeholder="เบอร์โทรศัพท์" className="w-full px-4 py-2 border rounded-lg" />
            <input type="email" name="email" value={contact.email || ''} onChange={handleChange} placeholder="อีเมล" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
            <button type="submit" className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
