import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        category: initialData.category || '',
        image: initialData.image || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: '',
        image: '',
        description: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear validation error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Please enter a valid price (>= 0)';
    }
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert price to a number
    const submittedData = {
      ...formData,
      price: Number(formData.price)
    };

    onSubmit(submittedData);

    // Reset form if creating a new product
    if (!initialData) {
      setFormData({
        name: '',
        price: '',
        category: '',
        image: '',
        description: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
        {initialData ? 'Edit Product' : 'Add New Product'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Logitech MX Master 3S"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 99.99"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
              errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
              errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Apparel">Apparel</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="e.g. https://example.com/image.jpg"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
              errors.image ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product details and specifications..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
            errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 mt-6 border-t pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition"
        >
          {initialData ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
