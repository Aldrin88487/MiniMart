import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, addToCartAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = ({ user, addToCart, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All', 'Electronics', 'Books', 'Apparel', 'Other']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null); // for detail modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch products using API filter
      const data = await getProductsAPI(searchQuery, selectedCategory);
      setProducts(data);
    } catch (err) {
      setError('Could not fetch products. Make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    await addToCart(productId);
  };

  const openDetailsModal = (product) => {
    setSelectedProduct(product);
  };

  const closeDetailsModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Pills / Filter bar */}
      <div className="flex flex-wrap items-center justify-center space-x-2 space-y-2 md:space-y-0 mb-8 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-500 mr-2">Filter Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main product display */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500 font-medium">Loading catalog...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-md text-center">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 rounded-lg text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 font-medium">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onViewDetails={openDetailsModal}
              onAddToCart={handleAddToCart}
              user={user}
            />
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs transition">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col md:flex-row">
            {/* Modal Image */}
            <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                }}
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-semibold uppercase tracking-wider">
                {selectedProduct.category}
              </span>
            </div>

            {/* Modal Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <button
                    onClick={closeDetailsModal}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-2xl font-extrabold text-blue-600 my-3">
                  ${selectedProduct.price.toFixed(2)}
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Description / Summary
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-sans">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center space-x-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct._id);
                    closeDetailsModal();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md text-sm font-semibold shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
