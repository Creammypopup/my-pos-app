import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/product/productSlice';
import { getContacts, createContact } from '../features/contact/contactSlice';
import { createSale, reset as resetSale } from '../features/sale/saleSlice';
import { FaSearch, FaUserPlus, FaTimes, FaPrint, FaCamera, FaPauseCircle, FaPlayCircle, FaReceipt, FaTv } from 'react-icons/fa';
import ContactModal from '../components/ContactModal';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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

// Payment Modal
const PaymentModal = ({ isOpen, onClose, onConfirm, total }) => {
    if (!isOpen) return null;
    const [paymentMethod, setPaymentMethod] = useState('เงินสด');
    const [dueDate, setDueDate] = useState('');
  
    const handleConfirm = () => {
        if (paymentMethod === 'ขายเชื่อ' && !dueDate) {
            toast.error('กรุณาระบุวันครบกำหนดชำระ');
            return;
        }
        onConfirm(paymentMethod, { dueDate });
    }
  
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
                <option>ขายเชื่อ</option>
              </select>
            </div>
             {paymentMethod === 'ขายเชื่อ' && (
               <div>
                  <label className="block text-sm font-medium text-gray-700">วันครบกำหนดชำระ</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">ยืนยัน</button>
          </div>
        </div>
      </div>
    );
};

// Receipt Modal
const ReceiptModal = ({ isOpen, onClose, sale, settings, user }) => {
    if (!isOpen || !sale) return null;
    
    const handlePrint = () => {
      const printContents = document.getElementById('receipt-printable').innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = `<div style="font-family: 'monospace'; font-size: 12px; width: 280px; padding: 10px;">${printContents}</div>`;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4">
          <div id="receipt-printable" className="text-gray-800 text-xs">
            <div className="text-center mb-2">
                <h3 className="text-sm font-bold">{settings?.storeName || 'CrePo-POS'}</h3>
                <p>{settings?.storeAddress}</p>
                <p>โทร: {settings?.storePhone}</p>
            </div>
            <hr className="my-1 border-dashed" />
            <div className="flex justify-between">
                <span>เลขที่:</span><span>{sale.receiptNumber}</span>
            </div>
             <div className="flex justify-between">
                <span>วันที่:</span><span>{new Date(sale.createdAt).toLocaleString('th-TH')}</span>
            </div>
             <div className="flex justify-between">
                <span>พนักงาน:</span><span>{user?.name || '-'}</span>
            </div>
             <div className="flex justify-between">
                <span>ลูกค้า:</span><span>{sale.customer?.name || 'ลูกค้าทั่วไป'}</span>
            </div>
            <hr className="my-1 border-dashed" />
            <table className="w-full my-1">
              <thead><tr><th className="text-left">รายการ</th><th className="text-center">จำนวน</th><th className="text-right">ราคา</th></tr></thead>
              <tbody>
                {sale.items.map(item => (
                  <tr key={item._id}><td>{item.name}</td><td className="text-center">{item.qty}</td><td className="text-right">{item.price.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
            <hr className="my-1 border-dashed" />
            <div className="text-right">
              <p>ยอดรวม: {sale.subtotal.toFixed(2)}</p>
              <p>ส่วนลด: {sale.discount.toFixed(2)}</p>
              <p className="font-bold">ทั้งหมด: {sale.total.toFixed(2)}</p>
            </div>
            <hr className="my-1 border-dashed" />
            <p className="text-center font-bold mt-2">ขอบคุณที่ใช้บริการ</p>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ปิด</button>
            <button onClick={handlePrint} className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><FaPrint className="mr-2" /> พิมพ์</button>
          </div>
        </div>
      </div>
    );
};

// Summary Modal
const SummaryModal = ({ isOpen, onClose, onConfirm, cart, totals }) => {
    if (!isOpen) return null;
    const promptPayQr = `000201010212306100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000-0115${totals.total.toFixed(2)}5802TH6304`;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">สรุปยอดก่อนชำระเงิน</h2>
          <div className="max-h-[50vh] overflow-y-auto pr-2">
            {cart.map(item => (
                <div key={item.cartId} className="flex justify-between items-center text-lg py-2 border-b">
                    <span>{item.name} ({item.qty})</span>
                    <span>{(item.qty * item.price).toLocaleString()} ฿</span>
                </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <div className="space-y-2 text-xl">
                  <div className="flex justify-between w-64"><span>ยอดรวม:</span> <span>{totals.subtotal.toLocaleString()} ฿</span></div>
                  <div className="flex justify-between w-64"><span>ส่วนลด:</span> <span className="text-red-500">{totals.discount.toLocaleString()} ฿</span></div>
                  <div className="flex justify-between w-64 font-bold text-3xl"><span>ทั้งหมด:</span> <span className="text-primary-dark">{totals.total.toLocaleString()} ฿</span></div>
              </div>
              <div className="text-center">
                  <QRCode value={promptPayQr} size={128}/>
                  <p className="text-sm mt-2">สแกนเพื่อชำระเงิน</p>
              </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg">กลับ</button>
            <button onClick={onConfirm} className="px-6 py-2 bg-primary-dark text-white rounded-lg">ดำเนินการชำระเงิน</button>
          </div>
        </div>
      </div>
    );
  };
  

function PosPage() {
    const dispatch = useDispatch();
    const { products, isLoading: productsLoading } = useSelector((state) => state.products);
    const { contacts } = useSelector((state) => state.contacts);
    const { settings } = useSelector((state) => state.settings);
    const { user } = useSelector((state) => state.auth);
    const { lastCreatedSale, isSuccess: isSaleSuccess } = useSelector((state) => state.sales);

    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [discount, setDiscount] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all');

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [productForUnitSelection, setProductForUnitSelection] = useState(null);
    const [newContact, setNewContact] = useState({ contactType: 'customer' });
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    
    const [heldBills, setHeldBills] = useState([]);
    const [isScannerActive, setIsScannerActive] = useState(false);
    const scannerRef = useRef(null);

    const customerDisplayChannel = useRef(new BroadcastChannel('pos_customer_display'));
    
    const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
    const total = useMemo(() => subtotal - (parseFloat(discount) || 0), [subtotal, discount]);
    
    useEffect(() => {
        customerDisplayChannel.current.postMessage({ cart, totals: { subtotal, discount, total } });
    }, [cart, subtotal, discount, total]);

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

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category || 'ไม่มีหมวดหมู่'));
        return ['all', ...Array.from(cats)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        let productList = products;

        if (activeCategory !== 'all') {
            productList = productList.filter(p => (p.category || 'ไม่มีหมวดหมู่') === activeCategory);
        }

        if (!lowercasedTerm) return productList;

        return productList.filter(p =>
            p.name.toLowerCase().includes(lowercasedTerm) ||
            (p.sku && p.sku.toLowerCase().includes(lowercasedTerm))
        );
    }, [products, searchTerm, activeCategory]);

    useEffect(() => {
        if (searchTerm && products.length > 0) {
            for (const product of products) {
                if (product.units && Array.isArray(product.units)) {
                    const matchingUnit = product.units.find(u => u.barcode && u.barcode === searchTerm);
                    if (matchingUnit) {
                        handleSelectUnit(product, matchingUnit);
                        setSearchTerm('');
                        break;
                    }
                }
            }
        }
    }, [searchTerm, products]);

    useEffect(() => {
        if (isScannerActive && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner('scanner-view', { fps: 10, qrbox: 250 }, false);
            const onScanSuccess = (decodedText) => {
                setSearchTerm(decodedText);
                setIsScannerActive(false); 
            };
            scanner.render(onScanSuccess);
            scannerRef.current = scanner;
        } else if (!isScannerActive && scannerRef.current) {
            scannerRef.current.clear().catch(error => console.error("Failed to clear scanner.", error));
            scannerRef.current = null;
        }
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => console.error("Failed to clear scanner on cleanup.", error));
            }
        };
    }, [isScannerActive]);


    const handleProductClick = (product) => {
        if (product.units && product.units.length > 1) {
            setProductForUnitSelection(product);
            setIsUnitModalOpen(true);
        } else if (product.units && product.units.length === 1) {
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

    const handleCheckout = (paymentMethod, paymentDetails) => {
        setIsPaymentModalOpen(false);
        if (paymentMethod === 'ขายเชื่อ' && !selectedCustomer) {
            toast.error('กรุณาเลือกข้อมูลลูกค้าสำหรับบิลขายเชื่อ');
            return;
        }
        const saleData = {
            customerId: selectedCustomer?._id,
            items: cart.map(item => ({ 
                productId: item.productId, 
                name: item.name, 
                qty: item.qty, 
                price: item.price,
                unitName: item.unitName
            })),
            subtotal,
            discount: parseFloat(discount) || 0,
            total,
            paymentMethod,
            paymentDetails,
        };
        dispatch(createSale(saleData));
    };

    const closeReceiptModal = useCallback(() => {
        setIsReceiptModalOpen(false);
        dispatch(resetSale());
    }, [dispatch]);

    const handleHoldBill = () => {
        if (cart.length === 0) return;
        const newHeldBill = {
            id: Date.now(),
            cart,
            customer: selectedCustomer,
            discount,
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        };
        setHeldBills(prev => [newHeldBill, ...prev]);
        setCart([]);
        setSelectedCustomer(null);
        setDiscount(0);
        toast.info(`พักบิล lúc ${newHeldBill.time} เรียบร้อย`);
    };

    const handleRecallBill = (billId) => {
        const billToRecall = heldBills.find(b => b.id === billId);
        if (billToRecall) {
            setCart(billToRecall.cart);
            setSelectedCustomer(billToRecall.customer);
            setDiscount(billToRecall.discount);
            setHeldBills(prev => prev.filter(b => b.id !== billId));
        }
    };
    
    const openCustomerDisplay = () => {
        window.open('/customer-display', '_blank', 'width=1024,height=768');
    };
    
    return (
        <>
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} onSave={handleSaveNewContact} contact={newContact} setContact={setNewContact} />
            <UnitSelectionModal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} product={productForUnitSelection} onSelectUnit={handleSelectUnit} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onConfirm={handleCheckout} total={total} />
            <ReceiptModal isOpen={isReceiptModalOpen} onClose={closeReceiptModal} sale={lastCreatedSale} settings={settings} user={user} />
            <SummaryModal isOpen={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)} onConfirm={() => {setIsSummaryModalOpen(false); setIsPaymentModalOpen(true);}} cart={cart} totals={{subtotal, discount, total}}/>
            
            <div className="flex h-[calc(100vh-80px)] bg-bg-main gap-4 p-4">
                <div className="w-3/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                             <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="ค้นหา หรือ สแกนบาร์โค้ด..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border rounded-full" />
                        </div>
                        <button onClick={() => setIsScannerActive(prev => !prev)} className={`p-3 rounded-full transition-colors ${isScannerActive ? 'bg-red-500 text-white' : 'bg-white'}`} title="สแกนด้วยกล้อง">
                            <FaCamera size={20}/>
                        </button>
                    </div>
                    {isScannerActive && (
                        <div id="scanner-view" className="w-full rounded-lg overflow-hidden shadow-lg animate-fade-in"></div>
                    )}
                    <div className="flex-grow bg-white p-4 rounded-2xl shadow-inner flex flex-col">
                        <div className="flex border-b mb-2 overflow-x-auto">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm font-semibold whitespace-nowrap ${activeCategory === cat ? 'border-b-2 border-primary-dark text-primary-dark' : 'text-text-secondary'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex-grow overflow-y-auto">
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
                </div>

                <div className="w-2/5 flex flex-col bg-white shadow-lg rounded-2xl p-4 gap-4">
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary-text">ข้อมูลลูกค้า</h2>
                            <button onClick={() => setIsContactModalOpen(true)} className="bg-purple-200 text-purple-700 p-2 rounded-lg hover:bg-purple-300"><FaUserPlus /></button>
                        </div>
                        {selectedCustomer ? (
                            <div className="bg-purple-100 p-3 rounded-lg relative mt-2">
                                <button onClick={() => setSelectedCustomer(null)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTimes /></button>
                                <p className="font-semibold">{selectedCustomer.name}</p>
                                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                            </div>
                        ) : (
                            <select onChange={(e) => setSelectedCustomer(contacts.find(c => c._id === e.target.value))} className="w-full p-2 border rounded-lg mt-2">
                                <option value="">-- ลูกค้าทั่วไป --</option>
                                {contacts.filter(c => c.contactType === 'customer').map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                            </select>
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
                    
                    <div className="border-t pt-4 mt-auto space-y-2">
                        <div className="flex justify-between"><p>ยอดรวม</p><p>{subtotal.toLocaleString()} ฿</p></div>
                        <div className="flex justify-between items-center">
                            <p>ส่วนลด</p>
                            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-24 text-right font-semibold border rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between text-xl font-bold text-purple-800"><p>ยอดชำระ</p><p>{total.toLocaleString()} ฿</p></div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <button onClick={handleHoldBill} disabled={cart.length === 0} className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-white py-3 rounded-xl font-bold disabled:bg-gray-400"><FaPauseCircle/> พักบิล</button>
                           <button onClick={() => setIsSummaryModalOpen(true)} disabled={cart.length === 0} className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-3 rounded-xl font-bold disabled:bg-gray-400"><FaReceipt/> สรุปยอด</button>
                       </div>
                        <button onClick={() => setIsPaymentModalOpen(true)} className="w-full bg-primary-dark text-white py-4 rounded-xl text-lg font-bold hover:bg-primary-text transition-colors disabled:bg-gray-400" disabled={cart.length === 0}>ชำระเงิน</button>
                    </div>
                </div>

                <div className="w-[200px] flex flex-col gap-4">
                    <div className="bg-white rounded-2xl shadow-lg p-3">
                        <button onClick={openCustomerDisplay} className="w-full flex items-center justify-center gap-2 text-sm bg-gray-200 py-2 rounded-lg hover:bg-gray-300"><FaTv className="mr-1"/> เปิดจอูลกค้า</button>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-3 flex-grow flex flex-col">
                        <h3 className="font-bold text-center mb-2 flex-shrink-0">บิลที่พักไว้</h3>
                        <div className="space-y-2 overflow-y-auto flex-grow">
                            {heldBills.map(bill => (
                                <button key={bill.id} onClick={() => handleRecallBill(bill.id)} className="w-full text-left p-2 bg-purple-100 rounded-lg hover:bg-purple-200">
                                    <div className="flex justify-between text-xs"><span>{bill.customer?.name || 'ลูกค้าทั่วไป'}</span><span>{bill.time}</span></div>
                                    <div className="font-bold text-purple-800">{(bill.cart.reduce((acc, i) => acc + (i.price*i.qty), 0) - bill.discount).toLocaleString()} ฿</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PosPage;