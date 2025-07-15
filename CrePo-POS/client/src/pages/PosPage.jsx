import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/product/productSlice';
import { getContacts, createContact } from '../features/contact/contactSlice';
import { createSale, reset as resetSale } from '../features/sale/saleSlice';
import { FaSearch, FaUserPlus, FaTimes, FaPrint } from 'react-icons/fa';
import ContactModal from '../components/ContactModal';
import { toast } from 'react-toastify';

// Unit Selection Modal
const UnitSelectionModal = ({ isOpen, onClose, product, onSelectUnit }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">เลือกหน่วย: {product.name}</h2>
                <div className="space-y-2">
                    {product.units.map(unit => (
                        <button 
                            key={unit.name}
                            onClick={() => onSelectUnit(product, unit)}
                            className="w-full text-left p-4 border rounded-lg hover:bg-purple-100 hover:border-purple-400"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{unit.name}</span>
                                <span className="font-bold text-purple-600">{unit.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
                </div>
            </div>
        </div>
    );
};

// Payment and Receipt Modals (No changes needed)
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
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [productForUnitSelection, setProductForUnitSelection] = useState(null);
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
    }, [isSaleSuccess, lastCreatedSale, dispatch]);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        const lowercasedTerm = searchTerm.toLowerCase();
        if (!lowercasedTerm) return products;
        return products.filter(p =>
            p.name.toLowerCase().includes(lowercasedTerm) ||
            (p.sku && p.sku.toLowerCase().includes(lowercasedTerm)) ||
            (p.category && p.category.toLowerCase().includes(lowercasedTerm)) ||
            (p.units?.some(u => u.barcode && u.barcode === searchTerm))
        );
    }, [products, searchTerm]);

    useEffect(() => {
        if (searchTerm && filteredProducts.length === 1) {
            const product = filteredProducts[0];
            const matchingUnit = product.units?.find(u => u.barcode === searchTerm);
            if(matchingUnit) {
                handleSelectUnit(product, matchingUnit);
                setSearchTerm('');
            }
        }
    }, [searchTerm, filteredProducts]);

    const handleProductClick = (product) => {
        if (product.units && product.units.length > 1) {
            setProductForUnitSelection(product);
            setIsUnitModalOpen(true);
        } else {
            handleSelectUnit(product, product.units[0]);
        }
    };
    
    const handleSelectUnit = (product, unit) => {
        const cartId = `${product._id}-${unit.name}`;
        const existingItem = cart.find(item => item.cartId === cartId);

        if (existingItem) {
            setCart(cart.map(item => item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, {
                cartId,
                productId: product._id,
                name: `${product.name} (${unit.name})`,
                qty: 1,
                price: unit.price,
                unitName: unit.name,
            }]);
        }
        setIsUnitModalOpen(false);
        setProductForUnitSelection(null);
    };

    const updateCartQuantity = (cartId, newQty) => {
        if (newQty <= 0) {
            setCart(cart.filter(item => item.cartId !== cartId));
        } else {
            setCart(cart.map(item => item.cartId === cartId ? { ...item, qty: newQty } : item));
        }
    };

    const handleSaveNewContact = (e) => {
        e.preventDefault();
        dispatch(createContact(newContact)).unwrap().then((created) => {
            setSelectedCustomer(created);
            toast.success('เพิ่มลูกค้าใหม่สำเร็จ!');
        });
        setIsContactModalOpen(false);
    };

    const handleCheckout = (paymentMethod) => {
        setIsPaymentModalOpen(false);
        const saleData = {
            customer: selectedCustomer?._id,
            items: cart.map(item => ({ 
                product: item.productId, 
                name: item.name, 
                qty: item.qty, 
                price: item.price 
            })),
            subtotal,
            discount: parseFloat(discount) || 0,
            total,
            paymentMethod,
        };
        dispatch(createSale(saleData));
    };

    const closeReceiptModal = useCallback(() => {
        setIsReceiptModalOpen(false);
        dispatch(resetSale());
    }, [dispatch]);

    const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
    const total = useMemo(() => subtotal - (parseFloat(discount) || 0), [subtotal, discount]);

    return (
        <>
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} onSave={handleSaveNewContact} contact={newContact} setContact={setNewContact} />
            <UnitSelectionModal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} product={productForUnitSelection} onSelectUnit={handleSelectUnit} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onConfirm={handleCheckout} total={total} />
            <ReceiptModal isOpen={isReceiptModalOpen} onClose={closeReceiptModal} sale={lastCreatedSale} />

            <div className="flex h-[calc(100vh-80px)] bg-bg-main">
                <div className="w-3/5 p-4 flex flex-col">
                    <div className="mb-4 relative">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="ค้นหา (ชื่อ, SKU, บาร์โค้ด, หมวดหมู่)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-main" />
                    </div>
                    <div className="flex-grow overflow-y-auto bg-white p-4 rounded-2xl shadow-inner">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {productsLoading ? <p>กำลังโหลดสินค้า...</p> : filteredProducts.map(product => (
                                <div key={product._id} onClick={() => handleProductClick(product)} className="border rounded-xl p-3 text-center cursor-pointer hover:shadow-lg hover:border-primary-main transition-all flex flex-col justify-between">
                                    <div className="w-full h-20 bg-purple-100 rounded-md mb-2 flex items-center justify-center text-purple-400 text-3xl font-bold">{product.name.charAt(0)}</div>
                                    <h3 className="font-semibold text-sm text-gray-800 leading-tight">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{product.units[0]?.price.toLocaleString()} ฿ / {product.units[0]?.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-2/5 p-4 flex flex-col bg-white shadow-lg">
                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold text-primary-text mb-2">ข้อมูลลูกค้า</h2>
                        {selectedCustomer ? (
                            <div className="bg-purple-100 p-3 rounded-lg relative">
                                <button onClick={() => setSelectedCustomer(null)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTimes /></button>
                                <p className="font-semibold">{selectedCustomer.name}</p>
                                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <select onChange={(e) => setSelectedCustomer(contacts.find(c => c._id === e.target.value))} className="w-full p-2 border rounded-lg">
                                    <option value="">-- ลูกค้าทั่วไป --</option>
                                    {contacts.filter(c => c.contactType === 'customer').map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
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
                                <div key={item.cartId} className="flex items-center mb-3">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">{Number(item.price).toLocaleString()} ฿</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => updateCartQuantity(item.cartId, item.qty - 1)} className="w-7 h-7 bg-gray-200 rounded-full">-</button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => updateCartQuantity(item.cartId, item.qty + 1)} className="w-7 h-7 bg-gray-200 rounded-full">+</button>
                                    </div>
                                    <p className="w-24 text-right font-semibold">{(item.price * item.qty).toLocaleString()} ฿</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t pt-4 mt-4 space-y-2">
                        <div className="flex justify-between"><p className="text-gray-600">ยอดรวม</p><p className="font-semibold">{subtotal.toLocaleString()} ฿</p></div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">ส่วนลด</p>
                            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-24 text-right font-semibold border rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between text-xl font-bold text-purple-800"><p>ยอดชำระ</p><p>{total.toLocaleString()} ฿</p></div>
                        <button onClick={() => setIsPaymentModalOpen(true)} className="w-full bg-primary-dark text-white py-4 rounded-xl text-lg font-bold hover:bg-primary-text transition-colors disabled:bg-gray-400" disabled={cart.length === 0}>ชำระเงิน</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PosPage;