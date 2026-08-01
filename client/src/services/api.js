import axios from 'axios';

// Looks for the Render environment variable first; defaults to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor to add JWT token to headers if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication Services
export const registerAPI = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const loginAPI = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const getMeAPI = async () => {
  const response = await api.get('/me');
  return response.data;
};

// Product Services
export const getProductsAPI = async (search = '', category = '') => {
  let url = `/products?search=${encodeURIComponent(search)}`;
  if (category && category !== 'All') {
    url += `&category=${encodeURIComponent(category)}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const createProductAPI = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProductAPI = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductAPI = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Cart Services
export const getCartAPI = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCartAPI = async (productId, quantity = 1, action = 'increment') => {
  const response = await api.post('/cart', { productId, quantity, action });
  return response.data;
};

export const removeFromCartAPI = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

export const clearCartAPI = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

export default api;
