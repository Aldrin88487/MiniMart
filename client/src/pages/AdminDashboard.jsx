import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, createProductAPI, updateProductAPI, deleteProductAPI } from '../services/api';
import ProductForm from '../components/ProductForm';

const AdminDashboard = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // holds product when editing

  const navigate = useNavigate();

  // Route protection - simple client-side check
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Access Denied. Admins only.');
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProductsAPI();
      setProducts(data);
    } catch (err) {
      setError('Could not fetch products for dashboard.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormError('');
      setSuccessMsg('');
      if (editingProduct) {
        // Edit mode
        await updateProductAPI(editingProduct._id, formData);
        setSuccessMsg('Product updated successfully!');
        setEditingProduct(null);
      } else {
        // Add mode
        await createProductAPI(formData);
        setSuccessMsg('Product added successfully!');
      }
      // Reload products list
      fetchProducts();
      
      // Auto clear success message
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setFormError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to submit product details.'
      );
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        setError('');
        await deleteProductAPI(productId);
        setSuccessMsg('Product deleted successfully!');
        fetchProducts();
        
        // Auto clear success message
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to delete product.'
        );
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormError('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h2>
          <p className="text-sm text-gray-500 font-mono mt-1">Product Catalog Management Console</p>
        </div>
        <div className="mt-4 md:mt-0 bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1.5 rounded-md font-mono">
          Admin Session: {user?.name} ({user?.email})
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md text-sm mb-6 transition">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      {/* Main Grid: Form on Top/Left, Table below/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Form Section */}
        <div className="lg:col-span-1">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs mb-3">
              {formError}
            </div>
          )}
          <ProductForm
            onSubmit={handleFormSubmit}
            initialData={editingProduct}
            onCancel={editingProduct ? handleCancelEdit : null}
          />
        </div>

        {/* Product List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Current Catalog Products</h3>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-3 text-sm text-gray-500">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                No products in the database. Use the form to add some!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded border bg-gray-50"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                            }}
                          />
                          <div>
                            <span className="font-semibold text-gray-900 block">{product.name}</span>
                            <span className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{product.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product._id, product.name)}
                            className="text-red-600 hover:text-red-800 font-medium hover:underline transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
