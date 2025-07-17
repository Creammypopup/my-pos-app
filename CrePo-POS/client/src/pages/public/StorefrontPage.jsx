import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const StorefrontPage = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const { cartItems } = useSelector((state) => state.cart);
    const { settings } = useSelector((state) => state.settings);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/public/products');
                setProducts(data);
            } catch (error) {
                console.error("Could not fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category || 'ไม่มีหมวดหมู่'));
        return ['all', ...Array.from(cats)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let productList = products;
        if (activeCategory !== 'all') {
            productList = productList.filter(p => (p.category || 'ไม่มีหมวดหมู่') === activeCategory);
        }
        if (searchTerm) {
            productList = productList.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return productList;
    }, [products, searchTerm, activeCategory]);


    const handleAddToCart = (product, unit) => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: unit.price,
            unitName: unit.name,
            qty: 1,
            cartId: `${product._id}-${unit.name}`
        }));
        toast.success(`${product.name} (${unit.name}) ถูกเพิ่มลงตะกร้า`);
    };

    return (
        <div className="bg-bg-main min-h-screen p-4 md:p-8">
            <header className="max-w-4xl mx-auto mb-8 text-center">
                <h1 className="text-4xl font-bold text-primary-text">{settings?.storeName || 'รายการสินค้า'}</h1>
                <p className="text-text-secondary mt-2">เลือกสินค้าที่คุณต้องการ</p>
            </header>

            <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-10 bg-bg-main/80 backdrop-blur-sm p-2 rounded-2xl">
                <div className="relative w-full md:flex-grow">
                    <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="ค้นหาสินค้า..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border rounded-full shadow-sm"
                    />
                </div>
                 <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="flex-grow md:hidden"></div>
                    <Link to="/cart" className="relative p-2">
                        <FaShoppingCart className="text-3xl text-primary-text" />
                        {cartItems.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>}
                    </Link>
                </div>
            </div>
            
             <div className="max-w-5xl mx-auto mb-6">
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${activeCategory === cat ? 'bg-primary-dark text-white' : 'bg-white text-text-secondary hover:bg-primary-light'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p className="text-center">กำลังโหลดสินค้า...</p>
            ) : (
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="bg-white rounded-2xl shadow-main p-4 flex flex-col hover:shadow-lg transition-shadow">
                            <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-4xl text-purple-200 font-bold">{product.name.charAt(0)}</div>
                            <h2 className="font-bold text-lg text-text-primary flex-grow">{product.name}</h2>
                            <p className="text-sm text-text-secondary">{product.category}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-primary-dark font-bold text-xl">{product.units[0].price.toLocaleString()} ฿</p>
                                <button onClick={() => handleAddToCart(product, product.units[0])} className="bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">เพิ่มลงตะกร้า</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StorefrontPage;