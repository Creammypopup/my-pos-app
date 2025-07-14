import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct, reset } from '../features/product/productSlice';
import { FaPlus, FaEdit, FaTrash, FaBarcode, FaFileImport, FaFileExport, FaPrint } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Barcode Modal Component
const BarcodeModal = ({ isOpen, onClose, product }) => {
  useEffect(() => {
    if (isOpen && product && product.sku) {
      try {
        window.JsBarcode("#barcode", product.sku, {
          format: "CODE128", lineColor: "#000", width: 2, height: 40, displayValue: true
        });
      } catch (e) {
        console.error("Barcode generation failed", e);
      }
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContents = document.getElementById('printable-barcode').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">พิมพ์ป้ายบาร์โค้ด</h2>
        <div id="printable-barcode" className="p-4 border rounded-lg text-center">
          <p className="font-semibold text-lg">{product.name}</p>
          <p className="text-2xl font-bold my-2">{Number(product.price).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
          {product.sku ? <svg id="barcode"></svg> : <p className="text-red-500">สินค้านี้ไม่มี SKU</p>}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ปิด</button>
          <button onClick={handlePrint} disabled={!product.sku} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400">พิมพ์</button>
        </div>
      </div>
    </div>
  );
};

// Product Modal Component
const ProductModal = ({ isOpen, onClose, onSave, product, setProduct }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl m-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{product._id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
        <form onSubmit={onSave} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อสินค้า *</label>
            <input name="name" value={product.name || ''} onChange={handleChange} className="mt-1 w-full px-4 py-2 border rounded-lg" required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU (รหัสสินค้า)</label>
              <input name="sku" value={product.sku || ''} onChange={handleChange} placeholder="เว้นว่างเพื่อสร้างอัตโนมัติ" className="mt-1 w-full px-4 py-2 border rounded-lg" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">หน่วยนับ *</label>
              <input name="unit" value={product.unit || ''} onChange={handleChange} placeholder="เช่น ชิ้น, กล่อง, ท่อน" className="mt-1 w-full px-4 py-2 border rounded-lg" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ต้นทุน *</label>
              <input type="number" name="cost" value={product.cost || ''} onChange={handleChange} placeholder="0.00" className="mt-1 w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ราคาขาย *</label>
              <input type="number" name="price" value={product.price || ''} onChange={handleChange} placeholder="0.00" className="mt-1 w-full px-4 py-2 border rounded-lg" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">จำนวนคงเหลือ *</label>
              <input type="number" name="quantity" value={product.quantity || ''} onChange={handleChange} placeholder="0" className="mt-1 w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">จุดสั่งซื้อ</label>
              <input type="number" name="lowStockThreshold" value={product.lowStockThreshold || ''} onChange={handleChange} placeholder="0" className="mt-1 w-full px-4 py-2 border rounded-lg" />
            </div>
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

// Main Products Page Component
function ProductsPage() {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector((state) => state.products);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const action = currentProduct._id 
      ? updateProduct(currentProduct)
      : createProduct(currentProduct);
      
    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success('บันทึกข้อมูลสำเร็จ!');
        setIsProductModalOpen(false);
      })
      .catch((err) => {
        // Error toast is already handled by the useEffect
      });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          toast.success('ลบสินค้าสำเร็จ!');
        })
        .catch((err) => {
          toast.error(err.message || 'ไม่สามารถลบสินค้าได้');
        });
    }
  };

  const openBarcodeModal = (product) => {
    setCurrentProduct(product);
    setIsBarcodeModalOpen(true);
  };

  const openProductModal = (product = {}) => {
    // When opening for a new product, ensure fields are empty or have sensible defaults
    const defaultProduct = {
        name: '',
        sku: '',
        unit: '',
        cost: '',
        price: '',
        quantity: '',
        lowStockThreshold: '',
    };
    setCurrentProduct(product._id ? product : defaultProduct);
    setIsProductModalOpen(true);
  };

  return (
    <>
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={handleSaveProduct} product={currentProduct} setProduct={setCurrentProduct} />
      <BarcodeModal isOpen={isBarcodeModalOpen} onClose={() => setIsBarcodeModalOpen(false)} product={currentProduct} />
      
      <div className="p-4 md:p-8 bg-purple-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-800">รายการสินค้า</h1>
            <div className="flex space-x-2">
                <button disabled className="flex items-center bg-white text-gray-400 px-3 py-2 border rounded-lg shadow-sm cursor-not-allowed text-sm"><FaFileImport className="mr-2"/> นำเข้า</button>
                <button disabled className="flex items-center bg-white text-gray-400 px-3 py-2 border rounded-lg shadow-sm cursor-not-allowed text-sm"><FaFileExport className="mr-2"/> ส่งออก</button>
                <button onClick={() => window.print()} className="flex items-center bg-white text-gray-700 px-3 py-2 border rounded-lg shadow-sm hover:bg-gray-50 text-sm"><FaPrint className="mr-2"/> พิมพ์</button>
                <button onClick={() => openProductModal()} className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 text-sm"><FaPlus className="mr-2" /> เพิ่มสินค้า</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-gray-600 font-semibold">ชื่อสินค้า</th>
                    <th className="p-4 text-gray-600 font-semibold">SKU</th>
                    <th className="p-4 text-gray-600 font-semibold">ราคา</th>
                    <th className="p-4 text-gray-600 font-semibold">คงเหลือ</th>
                    <th className="p-4 text-gray-600 font-semibold text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center p-8">กำลังโหลด...</td></tr>
                  ) : products && products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-800">{product.name}</td>
                        <td className="p-4 text-gray-500">{product.sku}</td>
                        <td className="p-4 text-gray-700">{!isNaN(product.price) ? Number(product.price).toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) : 'N/A'}</td>
                        <td className="p-4 text-gray-700">{`${product.quantity || 0} ${product.unit || ''}`}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => openBarcodeModal(product)} className="text-gray-500 hover:text-gray-700 p-2" title="พิมพ์บาร์โค้ด"><FaBarcode /></button>
                          <button onClick={() => openProductModal(product)} className="text-blue-500 hover:text-blue-700 p-2" title="แก้ไข"><FaEdit /></button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 p-2" title="ลบ"><FaTrash /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center p-8 text-gray-500">ยังไม่มีสินค้าในระบบ</td></tr>
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
