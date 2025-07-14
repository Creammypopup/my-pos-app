import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/product/productSlice';
import { getContacts, createContact } from '../features/contact/contactSlice';
import { createSale, reset as resetSale } from '../features/sale/saleSlice';
import { FaSearch, FaUserPlus, FaTimes, FaPrint } from 'react-icons/fa';
import ContactModal from '../components/ContactModal';
import { toast } from 'react-toastify';

// Payment Modal, Receipt Modal (No changes from previous version)
// ... (โค้ดของ PaymentModal และ ReceiptModal เหมือนเดิม)

const PaymentModal = ({ isOpen, onClose, onConfirm, total }) => {
  if (!isOpen) return null;
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">รับชำระเงิน</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ยอดชำระเงิน</label>
            <p className="text-3xl font-bold text-purple-600">{total.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">วิธีการชำระเงิน</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
              <option>เงินสด</option>
              <option>โอนจ่าย</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
          <button onClick={() => onConfirm(paymentMethod)} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">ยืนยันการชำระเงิน</button>
        </div>
      </div>
    </div>
  );
};

const ReceiptModal = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;
  
  const handlePrint = () => {
    const printContents = document.getElementById('receipt-printable').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = `<div style="font-family: 'monospace'; font-size: 12px; width: 280px;">${printContents}</div>`;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4">
        <div id="receipt-printable" className="text-center text-gray-800">
          <h3 className="text-lg font-bold">ใบเสร็จรับเงิน (ย่อ)</h3>
          <p className="text-sm">ร้าน CrePo POS</p>
          <hr className="my-2 border-dashed" />
          <p className="text-xs">เลขที่: {sale.receiptNumber}</p>
          <p className="text-xs">วันที่: {new Date(sale.createdAt).toLocaleString('th-TH')}</p>
          <hr className="my-2 border-dashed" />
          <table className="w-full text-left text-xs my-2">
            <thead><tr><th>รายการ</th><th>จำนวน</th><th>ราคา</th></tr></thead>
            <tbody>
              {sale.items.map(item => (
                <tr key={item._id}><td>{item.name}</td><td className="text-center">{item.qty}</td><td className="text-right">{item.price.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
          <hr className="my-2 border-dashed" />
          <div className="text-xs text-right">
            <p>ยอดรวม: {sale.subtotal.toFixed(2)}</p>
            <p>ส่วนลด: {sale.discount.toFixed(2)}</p>
            <p className="font-bold">ทั้งหมด: {sale.total.toFixed(2)}</p>
          </div>
          <hr className="my-2 border-dashed" />
          <p className="text-xs font-bold mt-4">ขอบคุณที่ใช้บริการ</p>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ปิด</button>
          <button onClick={handlePrint} className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><FaPrint className="mr-2" /> พิมพ์</button>
        </div>
      </div>
    </div>
  );
};


function PosPage() {
  const dispatch = useDispatch();
  
  const { products, isLoading: productsLoading } = useSelector((state) => state.products);
  const { contacts } = useSelector((state) => state.contacts);
  const { lastCreatedSale, isSuccess: isSaleSuccess } = useSelector((state) => state.sales);

  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ contactType: 'customer' });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    if (isSaleSuccess && lastCreatedSale) {
      toast.success('บันทึกการขายสำเร็จ!');
      setIsReceiptModalOpen(true);
      setCart([]);
      setDiscount(0);
      setSelectedCustomer(null);
    }
  }, [isSaleSuccess, lastCreatedSale]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm) return products;
    return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);
  
  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1, price: product.price }]);
    }
  };

  const updateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item._id !== productId));
    } else {
      setCart(cart.map(item => item._id === productId ? { ...item, qty: newQty } : item));
    }
  };
  
  const handleSaveNewContact = (e) => {
    e.preventDefault();
    dispatch(createContact(newContact)).then((action) => {
      if (action.payload) setSelectedCustomer(action.payload);
    });
    setIsContactModalOpen(false);
  };

  const handleCheckout = (paymentMethod) => {
    setIsPaymentModalOpen(false);
    const saleData = {
      customer: selectedCustomer?._id,
      items: cart.map(item => ({ product: item._id, name: item.name, qty: item.qty, price: item.price })),
      subtotal: subtotal,
      discount: parseFloat(discount) || 0,
      total: total,
      paymentMethod: paymentMethod,
    };
    dispatch(createSale(saleData));
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    dispatch(resetSale());
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
  const total = useMemo(() => subtotal - (parseFloat(discount) || 0), [subtotal, discount]);

  return (
    <>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} onSave={handleSaveNewContact} contact={newContact} setContact={setNewContact} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onConfirm={handleCheckout} total={total} />
      <ReceiptModal isOpen={isReceiptModalOpen} onClose={closeReceiptModal} sale={lastCreatedSale} />

      <div className="flex h-[calc(100vh-65px)] bg-gray-100">
        <div className="w-3/5 p-4 flex flex-col">
          <div className="mb-4 relative">
            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="ค้นหาสินค้า (ชื่อ, SKU)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div className="flex-grow overflow-y-auto bg-white p-4 rounded-2xl shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsLoading ? <p>กำลังโหลดสินค้า...</p> : filteredProducts.map(product => (
                <div key={product._id} onClick={() => addToCart(product)} className="border rounded-xl p-4 text-center cursor-pointer hover:shadow-lg hover:border-purple-400 transition-all">
                  <div className="w-full h-24 bg-purple-100 rounded-md mb-2 flex items-center justify-center text-purple-400 text-4xl font-bold">{product.name.charAt(0)}</div>
                  <h3 className="font-semibold text-sm text-gray-800">{product.name}</h3>
                  <p className="text-xs text-gray-500">{Number(product.price).toLocaleString()} ฿</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-2/5 p-4 flex flex-col bg-white shadow-lg">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-purple-800 mb-2">ข้อมูลลูกค้า</h2>
            {selectedCustomer ? (
              <div className="bg-purple-100 p-3 rounded-lg relative">
                  <button onClick={() => setSelectedCustomer(null)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTimes /></button>
                  <p className="font-semibold">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                  {selectedCustomer.address && <p className="text-xs text-gray-500 mt-1">{selectedCustomer.address}</p>}
              </div>
            ) : (
              <div className="flex space-x-2">
                  <select onChange={(e) => setSelectedCustomer(contacts.find(c => c._id === e.target.value))} className="w-full p-2 border rounded-lg">
                      <option value="">-- ลูกค้าทั่วไป --</option>
                      {contacts.filter(c => c.contactType === 'customer').map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                  </select>
                  <button onClick={() => setIsContactModalOpen(true)} className="bg-purple-200 text-purple-700 p-3 rounded-lg hover:bg-purple-300"><FaUserPlus /></button>
              </div>
            )}
          </div>

          <div className="flex-grow overflow-y-auto -mr-4 pr-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 h-full flex items-center justify-center"><p>ตะกร้าสินค้าว่าง</p></div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="flex items-center mb-3">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{Number(item.price).toLocaleString()} ฿</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => updateCartQuantity(item._id, item.qty - 1)} className="w-7 h-7 bg-gray-200 rounded-full">-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateCartQuantity(item._id, item.qty + 1)} className="w-7 h-7 bg-gray-200 rounded-full">+</button>
                  </div>
                  <p className="w-20 text-right font-semibold">{(item.price * item.qty).toLocaleString()} ฿</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between"><p className="text-gray-600">ยอดรวม</p><p className="font-semibold">{subtotal.toLocaleString()} ฿</p></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">ส่วนลด</p>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-24 text-right font-semibold border rounded px-2" />
              </div>
              <div className="flex justify-between text-xl font-bold text-purple-800"><p>ยอดชำระ</p><p>{total.toLocaleString()} ฿</p></div>
              <button onClick={() => setIsPaymentModalOpen(true)} className="w-full bg-purple-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-purple-700 transition-colors disabled:bg-gray-400" disabled={cart.length === 0}>ชำระเงิน</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PosPage;
