import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor to add JWT token to headers if available
API.interceptors.request.use((config) => {
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
  const response = await API.post('/register', userData);
  return response.data;
};

export const loginAPI = async (credentials) => {
  const response = await API.post('/login', credentials);
  return response.data;
};

export const getMeAPI = async () => {
  const response = await API.get('/me');
  return response.data;
};

// Product Services
export const getProductsAPI = async (search = '', category = '') => {
  let url = `/products?search=${encodeURIComponent(search)}`;
  if (category && category !== 'All') {
    url += `&category=${encodeURIComponent(category)}`;
  }
  const response = await API.get(url);
  return response.data;
};

export const createProductAPI = async (productData) => {
  const response = await API.post('/products', productData);
  return response.data;
};

export const updateProductAPI = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductAPI = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

// Cart Services
export const getCartAPI = async () => {
  const response = await API.get('/cart');
  return response.data;
};

export const addToCartAPI = async (productId, quantity = 1, action = 'increment') => {
  const response = await API.post('/cart', { productId, quantity, action });
  return response.data;
};

export const removeFromCartAPI = async (productId) => {
  const response = await API.delete(`/cart/${productId}`);
  return response.data;
};

export const clearCartAPI = async () => {
  const response = await API.delete('/cart');
  return response.data;
};

export default API;
