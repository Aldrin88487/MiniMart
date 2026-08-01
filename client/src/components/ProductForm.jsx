import React, { useState, useEffect } from 'react';
import { uploadProductImageAPI } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
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
      // Show preview for existing image
      if (initialData.image) {
        setImagePreview(
          initialData.image.startsWith('/uploads')
            ? `${API_URL}${initialData.image}`
            : initialData.image
        );
      }
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        price: '',
        category: '',
        image: '',
        description: ''
      });
      setImageFile(null);
      setImagePreview('');
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear URL field and any image error
      setFormData({ ...formData, image: '' });
      if (errors.image) {
        setErrors({ ...errors, image: '' });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Please enter a valid price (>= 0)';
    }
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    // Image is required: either a file was selected or a URL was typed
    if (!imageFile && !formData.image.trim()) {
      newErrors.image = 'Please upload an image or enter a URL';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let imageValue = formData.image;

    // If a file was selected, upload it first
    if (imageFile) {
      try {
        setUploading(true);
        const uploadResult = await uploadProductImageAPI(imageFile);
        imageValue = uploadResult.image; // e.g. "/uploads/image-123456.jpg"
      } catch (err) {
        setErrors({ ...errors, image: 'Image upload failed. Please try again.' });
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // Convert price to a number
    const submittedData = {
      ...formData,
      image: imageValue,
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
      setImageFile(null);
      setImagePreview('');
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
      </div>

      {/* Image Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
        
        {/* File Upload */}
        <div className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-blue-400 transition ${
          errors.image ? 'border-red-400' : 'border-gray-300'
        }`}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border mb-2"
                />
                <span className="text-xs text-blue-600 hover:underline">Click to change image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Click to upload image</span>
                <span className="text-xs text-gray-300 mt-0.5">JPEG, PNG, WebP (max 5MB)</span>
              </div>
            )}
          </label>
        </div>

        {/* OR separator */}
        <div className="flex items-center my-3">
          <hr className="flex-1 border-gray-200" />
          <span className="px-2 text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* URL Input */}
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={(e) => {
            handleChange(e);
            // Clear file selection if user types a URL
            if (e.target.value) {
              setImageFile(null);
              setImagePreview(e.target.value);
            }
          }}
          placeholder="Or paste an image URL..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
            errors.image ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
        />
        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
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
          disabled={uploading}
          className={`px-5 py-2 rounded-md text-sm font-medium shadow-sm transition ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : initialData ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
