import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts, createContact, updateContact, deleteContact, reset } from '../features/contact/contactSlice';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ContactModal from '../components/ContactModal';

function ContactsPage() {
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.contacts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({ contactType: 'customer', creditLimit: 0 });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(getContacts());
    return () => dispatch(reset());
  }, [dispatch]);

  const filteredContacts = useMemo(() => {
    if (activeTab === 'customer') return contacts.filter(c => c.contactType === 'customer');
    if (activeTab === 'supplier') return contacts.filter(c => c.contactType === 'supplier');
    return contacts;
  }, [contacts, activeTab]);

  const handleSave = (e) => {
    e.preventDefault();
    if (currentContact._id) {
      dispatch(updateContact(currentContact));
    } else {
      dispatch(createContact(currentContact));
    }
    setIsModalOpen(false);
  };

  const openEditModal = (contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentContact({ 
      contactType: activeTab === 'supplier' ? 'supplier' : 'customer',
      creditLimit: 0
    });
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ติดต่อนี้?')) {
      dispatch(deleteContact(id));
    }
  };

  const TabButton = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          isActive ? 'bg-white text-purple-700' : 'bg-transparent text-gray-500 hover:text-purple-600'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} contact={currentContact} setContact={setCurrentContact} />
      <div className="p-4 md:p-8 bg-purple-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-800">จัดการผู้ติดต่อ</h1>
            <button onClick={openCreateModal} className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600">
              <FaPlus className="mr-2" /> เพิ่มผู้ติดต่อ
            </button>
          </div>
          <div className="border-b border-gray-200">
            <TabButton tabName="all" label="ทั้งหมด" />
            <TabButton tabName="customer" label="ลูกค้า" />
            <TabButton tabName="supplier" label="ผู้จัดจำหน่าย" />
          </div>
          <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-gray-600 font-semibold">ชื่อ</th>
                    <th className="p-4 text-gray-600 font-semibold">ประเภท</th>
                    <th className="p-4 text-gray-600 font-semibold">เบอร์โทรศัพท์</th>
                    <th className="p-4 text-gray-600 font-semibold text-right">ยอดค้างชำระ</th>
                    <th className="p-4 text-gray-600 font-semibold text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center p-8">กำลังโหลด...</td></tr>
                  ) : filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-800">{contact.name}</td>
                        <td className="p-4 text-gray-500">{contact.contactType === 'customer' ? 'ลูกค้า' : 'ผู้จัดจำหน่าย'}</td>
                        <td className="p-4 text-gray-700">{contact.phone}</td>
                        <td className={`p-4 text-right font-semibold ${contact.currentBalance > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {contact.contactType === 'customer' ? (contact.currentBalance || 0).toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) : '-'}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => openEditModal(contact)} className="text-blue-500 hover:text-blue-700 p-2"><FaEdit /></button>
                          <button onClick={() => handleDeleteClick(contact._id)} className="text-red-500 hover:text-red-700 p-2 ml-2"><FaTrash /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center p-8 text-gray-500">ไม่พบข้อมูลในหมวดหมู่นี้</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactsPage;