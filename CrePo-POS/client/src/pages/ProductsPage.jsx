import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct, reset } from '../features/product/productSlice';
import { FaPlus, FaEdit, FaTrash, FaBarcode, FaPrint, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Product Modal for Add/Edit
const ProductModal = ({ isOpen, onClose, onSave, product, setProduct }) => {
    if (!isOpen) return null;

    const handleBaseChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleUnitChange = (index, e) => {
        const { name, value } = e.target;
        const newUnits = [...product.units];
        newUnits[index] = { ...newUnits[index], [name]: value };
        setProduct(prev => ({ ...prev, units: newUnits }));
    };
    
    const addUnit = () => {
        setProduct(prev => ({
            ...prev,
            units: [...(prev.units || []), { name: '', price: 0, cost: 0, conversionRate: 1, barcode: '' }]
        }));
    };
    
    const removeUnit = (index) => {
        // Cannot remove the base unit
        if (index === 0) {
            toast.error('ไม่สามารถลบหน่วยพื้นฐานได้');
            return;
        }
        setProduct(prev => ({
            ...prev,
            units: prev.units.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{product._id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
                <form onSubmit={onSave} className="flex-grow overflow-y-auto pr-4 space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ชื่อสินค้า *</label>
                            <input name="name" value={product.name || ''} onChange={handleBaseChange} className="mt-1 w-full px-4 py-2 border rounded-lg" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                            <input name="category" value={product.category || ''} onChange={handleBaseChange} className="mt-1 w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SKU (รหัสหลัก)</label>
                            <input name="sku" value={product.sku || ''} onChange={handleBaseChange} placeholder="เว้นว่างเพื่อสร้างอัตโนมัติ" className="mt-1 w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">จำนวนคงเหลือ (หน่วยเล็กสุด) *</label>
                            <input type="number" name="quantity" value={product.quantity || ''} onChange={handleBaseChange} placeholder="0" className="mt-1 w-full px-4 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">จุดสั่งซื้อ (หน่วยเล็กสุด)</label>
                            <input type="number" name="lowStockThreshold" value={product.lowStockThreshold || ''} onChange={handleBaseChange} placeholder="0" className="mt-1 w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">หน่วยสินค้าและราคา</h3>
                        <p className="text-xs text-gray-500 mb-4">หน่วยแรกคือหน่วยพื้นฐาน (หน่วยที่เล็กที่สุด) ซึ่งจะใช้ในการนับสต็อก</p>
                        {product.units?.map((unit, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-10 gap-2 mb-2 p-3 bg-gray-50 rounded-lg items-center">
                                <input name="name" value={unit.name} onChange={(e) => handleUnitChange(index, e)} placeholder="ชื่อหน่วย (เช่น ชิ้น)" className="md:col-span-2 w-full px-2 py-1 border rounded" required />
                                <input name="price" value={unit.price} type="number" onChange={(e) => handleUnitChange(index, e)} placeholder="ราคาขาย" className="md:col-span-2 w-full px-2 py-1 border rounded" required />
                                <input name="cost" value={unit.cost} type="number" onChange={(e) => handleUnitChange(index, e)} placeholder="ราคาต้นทุน" className="md:col-span-2 w-full px-2 py-1 border rounded" />
                                <input name="conversionRate" value={unit.conversionRate} type="number" readOnly={index === 0} onChange={(e) => handleUnitChange(index, e)} placeholder="อัตราแปลง" className={`md:col-span-1 w-full px-2 py-1 border rounded ${index === 0 ? 'bg-gray-200' : ''}`} required />
                                <input name="barcode" value={unit.barcode} onChange={(e) => handleUnitChange(index, e)} placeholder="บาร์โค้ด" className="md:col-span-2 w-full px-2 py-1 border rounded" />
                                {index > 0 && (
                                    <button type="button" onClick={() => removeUnit(index)} className="md:col-span-1 text-red-500 hover:text-red-700 p-2"><FaTimes /></button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addUnit} className="mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800">+ เพิ่มหน่วยใหม่</button>
                    </div>
                
                </form>
                <div className="flex justify-end space-x-4 pt-4 mt-auto border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
                    <button type="button" onClick={onSave} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">บันทึก</button>
                </div>
            </div>
        </div>
    );
};

// Barcode Printing Modal
const BarcodePrintModal = ({ isOpen, onClose, items }) => {
    useEffect(() => {
        if (isOpen && items.length > 0) {
            items.forEach(item => {
                try {
                    window.JsBarcode(`#barcode-${item.barcode}`, item.barcode, {
                        format: "CODE128", lineColor: "#000", width: 2, height: 40, displayValue: true, fontSize: 14, margin: 10
                    });
                } catch (e) {
                    console.error(`Barcode generation failed for ${item.barcode}`, e);
                }
            });
        }
    }, [isOpen, items]);

    if (!isOpen) return null;

    const handlePrint = () => {
        const printContents = document.getElementById('barcode-printable-area').innerHTML;
        const originalContents = document.body.innerHTML;
        const styles = `<style>
            @media print { body { -webkit-print-color-adjust: exact; } @page { size: auto; margin: 10mm; } }
            .barcode-item { display: inline-block; text-align: center; margin: 5px; padding: 5px; border: 1px solid #ccc; border-radius: 5px; }
        </style>`;
        document.body.innerHTML = styles + printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl m-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">พิมพ์ป้ายบาร์โค้ด</h2>
                <div id="barcode-printable-area" className="p-4 border rounded-lg text-center bg-gray-50 max-h-96 overflow-y-auto">
                    {items.map(item => (
                        <div key={item.barcode} className="barcode-item">
                            <p className="font-semibold text-md">{item.productName}</p>
                            <p className="text-sm text-gray-600">{item.unitName}</p>
                            <p className="text-lg font-bold my-1">{Number(item.price).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
                            <svg id={`barcode-${item.barcode}`}></svg>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ปิด</button>
                    <button onClick={handlePrint} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                        <FaPrint className="inline-block mr-2" /> พิมพ์
                    </button>
                </div>
            </div>
        </div>
    );
};


// Main Products Page Component
function ProductsPage() {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({});
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        dispatch(getProducts());
        return () => dispatch(reset());
    }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
    }, [isError, message]);

    const handleSaveProduct = useCallback(() => {
        const action = currentProduct._id ? updateProduct(currentProduct) : createProduct(currentProduct);
        dispatch(action).unwrap()
            .then(() => {
                toast.success('บันทึกข้อมูลสำเร็จ!');
                setIsModalOpen(false);
            })
            .catch((err) => toast.error(err.message || 'ไม่สามารถบันทึกได้'));
    }, [dispatch, currentProduct]);

    const handleDeleteProduct = (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
            dispatch(deleteProduct(id)).unwrap()
                .then(() => toast.success('ลบสินค้าสำเร็จ!'))
                .catch((err) => toast.error(err.message || 'ไม่สามารถลบสินค้าได้'));
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct(JSON.parse(JSON.stringify(product))); // Deep copy
        } else {
            setCurrentProduct({
                name: '', sku: '', category: '', quantity: 0, lowStockThreshold: 0,
                units: [{ name: '', price: 0, cost: 0, conversionRate: 1, barcode: '' }]
            });
        }
        setIsModalOpen(true);
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(new Set(filteredProducts.map(p => p._id)));
        } else {
            setSelectedProducts(new Set());
        }
    };

    const openBarcodePrintModal = () => {
        if (selectedProducts.size === 0) {
            toast.info('กรุณาเลือกสินค้าที่ต้องการพิมพ์บาร์โค้ด');
            return;
        }
        setIsBarcodeModalOpen(true);
    };
    
    const itemsToPrint = Array.from(selectedProducts).flatMap(id => {
        const product = products.find(p => p._id === id);
        if (!product) return [];
        return product.units
            .filter(unit => unit.barcode)
            .map(unit => ({
                productName: product.name,
                unitName: unit.name,
                price: unit.price,
                barcode: unit.barcode,
            }));
    });

    return (
        <>
            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} product={currentProduct} setProduct={setCurrentProduct} />
            <BarcodePrintModal isOpen={isBarcodeModalOpen} onClose={() => setIsBarcodeModalOpen(false)} items={itemsToPrint} />

            <div className="p-4 md:p-8 bg-bg-main min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <h1 className="text-3xl font-bold text-primary-text">รายการสินค้า</h1>
                        <div className="flex items-center gap-2">
                             <input 
                                type="text"
                                placeholder="ค้นหา (ชื่อ, SKU, หมวดหมู่)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 px-4 py-2 border rounded-lg"
                            />
                            <button onClick={openBarcodePrintModal} className="flex items-center bg-white text-gray-700 px-3 py-2 border rounded-lg shadow-sm hover:bg-gray-50 text-sm"><FaBarcode className="mr-2" /> พิมพ์บาร์โค้ด</button>
                            <button onClick={() => openModal()} className="flex items-center bg-primary-main text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark text-sm"><FaPlus className="mr-2" /> เพิ่มสินค้า</button>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 w-12 text-center"><input type="checkbox" onChange={handleSelectAll} className="form-checkbox" /></th>
                                        <th className="p-4 text-text-secondary font-semibold">ชื่อสินค้า</th>
                                        <th className="p-4 text-text-secondary font-semibold">หมวดหมู่</th>
                                        <th className="p-4 text-text-secondary font-semibold">คงเหลือ (หน่วยเล็กสุด)</th>
                                        <th className="p-4 text-text-secondary font-semibold text-center">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="5" className="text-center p-8">กำลังโหลด...</td></tr>
                                    ) : filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <tr key={product._id} className="border-b border-border-color hover:bg-purple-50">
                                                <td className="p-4 text-center"><input type="checkbox" checked={selectedProducts.has(product._id)} onChange={() => handleSelectProduct(product._id)} className="form-checkbox" /></td>
                                                <td className="p-4 text-gray-800">
                                                    <div>{product.name}</div>
                                                    <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                                                </td>
                                                <td className="p-4 text-gray-500">{product.category}</td>
                                                <td className="p-4 text-gray-700">{`${product.quantity || 0} ${product.units[0]?.name || ''}`}</td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => openModal(product)} className="text-blue-500 hover:text-blue-700 p-2" title="แก้ไข"><FaEdit /></button>
                                                    <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 p-2" title="ลบ"><FaTrash /></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center p-8 text-gray-500">ไม่พบสินค้าในระบบ</td></tr>
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

export default ProductsPage;