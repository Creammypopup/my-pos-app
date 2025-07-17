import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct, reset } from '../features/product/productSlice';
import { FaPlus, FaEdit, FaTrash, FaBarcode, FaPrint, FaTimes, FaSearch, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';

// ... (formatStockDisplay, ProductModal)

const BulkBarcodePrintModal = ({ isOpen, onClose, productsToPrint }) => {
    // ... (This is a new, complex modal for handling bulk printing logic)
};

function ProductsPage() {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [isBulkPrintModalOpen, setIsBulkPrintModalOpen] = useState(false);
    const [productToPrint, setProductToPrint] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());

    // ... (useEffect, handleSaveProduct, openModal)

    const toggleProductSelection = (productId) => {
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
    
    const openBulkPrintModal = () => {
        setIsBulkPrintModalOpen(true);
    };

    const selectedProductsForBulkPrint = useMemo(() => {
        return products.filter(p => selectedProducts.has(p._id));
    }, [products, selectedProducts]);


    return (
        <>
            {/* ... (ProductModal, BarcodePrintModal) ... */}
            {/* <BulkBarcodePrintModal isOpen={isBulkPrintModalOpen} onClose={() => setIsBulkPrintModalOpen(false)} productsToPrint={selectedProductsForBulkPrint} /> */}

            <div className="p-4 md:p-8 bg-bg-main min-h-screen">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-primary-text">รายการสินค้า</h1>
                    <div className="flex items-center gap-2">
                        {/* ... (Search bar) ... */}
                        {selectedProducts.size > 0 && (
                            <button onClick={openBulkPrintModal} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 text-sm">
                                <FaPrint className="mr-2" /> พิมพ์บาร์โค้ดที่เลือก ({selectedProducts.size})
                            </button>
                        )}
                        <button onClick={() => openModal()} className="flex items-center bg-primary-main text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark text-sm"><FaPlus className="mr-2" /> เพิ่มสินค้า</button>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 w-12 text-center"><input type="checkbox" className="form-checkbox" disabled/></th>
                                    <th className="p-4">ชื่อสินค้า</th>
                                    <th className="p-4">หมวดหมู่</th>
                                    <th className="p-4">คงเหลือ</th>
                                    <th className="p-4 text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className={`${selectedProducts.has(product._id) ? 'bg-purple-100' : ''} border-b hover:bg-gray-50`}>
                                        <td className="p-4 text-center">
                                            <input type="checkbox" className="form-checkbox h-5 w-5 rounded" checked={selectedProducts.has(product._id)} onChange={() => toggleProductSelection(product._id)}/>
                                        </td>
                                        {/* ... (Other table data) ... */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductsPage;