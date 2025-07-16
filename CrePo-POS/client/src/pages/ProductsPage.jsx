import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct, reset } from '../features/product/productSlice';
import { FaPlus, FaEdit, FaTrash, FaBarcode, FaPrint, FaTimes, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Helper to display stock in largest unit
const formatStockDisplay = (product) => {
    if (!product || !product.units || product.units.length === 0 || typeof product.quantity !== 'number') {
        return 'N/A';
    }
    let remainingQty = product.quantity;
    const sortedUnits = [...product.units].sort((a, b) => b.conversionRate - a.conversionRate);
    
    if (remainingQty === 0) return `0 ${sortedUnits[0]?.name || 'หน่วย'}`;

    const largestUnit = sortedUnits[0];
    
    if (!largestUnit || largestUnit.conversionRate === 0) return `${remainingQty} ${product.units[0]?.name || ''}`;
    
    const largestUnitCount = Math.floor(remainingQty / largestUnit.conversionRate);
    remainingQty %= largestUnit.conversionRate;
    
    let displayString = '';
    if (largestUnitCount > 0) {
        displayString += `${largestUnitCount} ${largestUnit.name}`;
    }
    if (remainingQty > 0) {
        displayString += (displayString ? ' ' : '') + `${remainingQty} ${product.units[0].name}`;
    }
    return displayString || `0 ${product.units[0].name}`;
};

// ... (BarcodePrintModal remains the same)

const ProductModal = ({ isOpen, onClose, onSave, product, setProduct, allProducts }) => {
    if (!isOpen) return null;

    const handleBaseChange = (e) => {
        const { name, value, type } = e.target;
        setProduct(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleUnitChange = (index, e) => {
        const { name, value, type } = e.target;
        const newUnits = [...product.units];
        newUnits[index] = { ...newUnits[index], [name]: type === 'number' ? Number(value) : value };
        setProduct(prev => ({ ...prev, units: newUnits }));
    };

    const addUnit = () => setProduct(prev => ({ ...prev, units: [...(prev.units || []), { name: '', price: 0, cost: 0, conversionRate: 1, barcode: '' }]}));
    const removeUnit = (index) => { if (index > 0) setProduct(prev => ({ ...prev, units: prev.units.filter((_, i) => i !== index) })); };

    // Handlers for bundled items
    const addBundledItem = () => setProduct(prev => ({ ...prev, bundledItems: [...(prev.bundledItems || []), { product: '', quantity: 1 }] }));
    const removeBundledItem = (index) => setProduct(prev => ({ ...prev, bundledItems: prev.bundledItems.filter((_, i) => i !== index) }));
    const handleBundledItemChange = (index, field, value) => {
        const newItems = [...product.bundledItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setProduct(prev => ({ ...prev, bundledItems: newItems }));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{product._id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
                <form onSubmit={onSave} className="flex-grow overflow-y-auto pr-4 space-y-4">
                    <select name="productType" value={product.productType || 'standard'} onChange={handleBaseChange} className="w-full px-4 py-2 border rounded-lg">
                        <option value="standard">สินค้าทั่วไป (นับสต็อก)</option>
                        <option value="bundle">สินค้าจัดเซ็ต</option>
                        <option value="service">บริการ (ไม่นับสต็อก)</option>
                    </select>
                    {/* ... (other fields like name, category, sku) ... */}
                    {product.productType === 'bundle' ? (
                        <div className="pt-4 mt-4 border-t">
                             <h3 className="text-lg font-semibold text-gray-700 mb-2">สินค้าในเซ็ต</h3>
                             {product.bundledItems?.map((item, index) => (
                                 <div key={index} className="flex items-center gap-2 mb-2">
                                     <select value={item.product} onChange={(e) => handleBundledItemChange(index, 'product', e.target.value)} className="w-full px-2 py-1 border rounded" required>
                                         <option value="">-- เลือกสินค้า --</option>
                                         {allProducts.filter(p => p.productType === 'standard').map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                     </select>
                                     <input type="number" value={item.quantity} onChange={(e) => handleBundledItemChange(index, 'quantity', Number(e.target.value))} className="w-24 px-2 py-1 border rounded" min="1" required/>
                                     <button type="button" onClick={() => removeBundledItem(index)} className="text-red-500"><FaTimes/></button>
                                 </div>
                             ))}
                             <button type="button" onClick={addBundledItem} className="mt-2 text-sm text-purple-600">+ เพิ่มสินค้าในเซ็ต</button>
                        </div>
                    ) : (
                        // Standard product stock fields
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                                <label className="block text-sm font-medium text-gray-700">จำนวนคงเหลือ (หน่วยเล็กสุด) *</label>
                                <input type="number" name="quantity" value={product.quantity || 0} onChange={handleBaseChange} className="mt-1 w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">จุดสั่งซื้อ (หน่วยเล็กสุด)</label>
                                <input type="number" name="lowStockThreshold" value={product.lowStockThreshold || 0} onChange={handleBaseChange} className="mt-1 w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    )}
                     <div className="pt-4 mt-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">หน่วยสินค้าและราคา</h3>
                        <p className="text-xs text-gray-500 mb-4">หน่วยแรกคือหน่วยพื้นฐาน (หน่วยที่เล็กที่สุด) ซึ่งจะใช้ในการนับสต็อก</p>
                        {product.units?.map((unit, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 mb-2 p-3 bg-gray-50 rounded-lg items-center">
                                <input name="name" value={unit.name} onChange={(e) => handleUnitChange(index, e)} placeholder="ชื่อหน่วย" className="col-span-3 w-full px-2 py-1 border rounded" required />
                                <input name="price" value={unit.price} type="number" onChange={(e) => handleUnitChange(index, e)} placeholder="ราคาขาย" className="col-span-2 w-full px-2 py-1 border rounded" required />
                                <input name="cost" value={unit.cost} type="number" onChange={(e) => handleUnitChange(index, e)} placeholder="ต้นทุน" className="col-span-2 w-full px-2 py-1 border rounded" />
                                <div className="col-span-2">
                                    <p className="text-sm font-semibold">{`กำไร: ${(unit.price - unit.cost).toLocaleString()}`}</p>
                                </div>
                                <input name="conversionRate" value={unit.conversionRate} type="number" readOnly={index === 0} onChange={(e) => handleUnitChange(index, e)} placeholder="แปลงค่า" title="จำนวนหน่วยเล็กสุดในหน่วยนี้" className={`col-span-2 w-full px-2 py-1 border rounded ${index === 0 ? 'bg-gray-200' : ''}`} required />
                                {index > 0 && <button type="button" onClick={() => removeUnit(index)} className="col-span-1 text-red-500 hover:text-red-700 p-2"><FaTimes /></button>}
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
// ... Main ProductsPage component remains largely the same
function ProductsPage() {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({});
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

    const handleSaveProduct = useCallback(() => {
        const action = currentProduct._id ? updateProduct(currentProduct) : createProduct(currentProduct);
        dispatch(action).unwrap().then(() => {
            toast.success('บันทึกข้อมูลสำเร็จ!');
            setIsModalOpen(false);
        }).catch((err) => toast.error(err.message || 'ไม่สามารถบันทึกได้'));
    }, [dispatch, currentProduct]);

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct(JSON.parse(JSON.stringify(product)));
        } else {
            setCurrentProduct({
                name: '', sku: '', category: '', quantity: 0, lowStockThreshold: 0, productType: 'standard',
                units: [{ name: '', price: 0, cost: 0, conversionRate: 1, barcode: '' }],
                bundledItems: []
            });
        }
        setIsModalOpen(true);
    };

    return (
        <>
            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} product={currentProduct} setProduct={setCurrentProduct} allProducts={products} />
            <div className="p-4 md:p-8 bg-bg-main min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <h1 className="text-3xl font-bold text-primary-text">รายการสินค้า</h1>
                        <div className="flex items-center gap-2">
                             <div className="relative">
                                 <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                 <input type="text" placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 pl-10 pr-4 py-2 border rounded-lg" />
                             </div>
                            <button onClick={() => openModal()} className="flex items-center bg-primary-main text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark text-sm"><FaPlus className="mr-2" /> เพิ่มสินค้า</button>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-text-secondary font-semibold">ชื่อสินค้า</th>
                                        <th className="p-4 text-text-secondary font-semibold">หมวดหมู่</th>
                                        <th className="p-4 text-text-secondary font-semibold">คงเหลือ</th>
                                        <th className="p-4 text-text-secondary font-semibold text-center">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="4" className="text-center p-8">กำลังโหลด...</td></tr>
                                    ) : filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <tr key={product._id} className="border-b border-border-color hover:bg-purple-50">
                                                <td className="p-4 text-gray-800">
                                                    <div>{product.name}</div>
                                                    <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                                                </td>
                                                <td className="p-4 text-gray-500">{product.category}</td>
                                                <td className="p-4 text-gray-700">{product.productType === 'standard' ? formatStockDisplay(product) : <span className="text-xs italic text-gray-400">สินค้าจัดเซ็ต</span>}</td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => openModal(product)} className="text-blue-500 hover:text-blue-700 p-2" title="แก้ไข"><FaEdit /></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center p-8 text-gray-500">ไม่พบสินค้าในระบบ</td></tr>
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