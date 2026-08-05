import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OrderPlaced from './pages/OrderPlaced';
import Checkout from './pages/Checkout';
import { getCartAPI, addToCartAPI, removeFromCartAPI, clearCartAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartLoading, setCartLoading] = useState(false);

  // Load user from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // Fetch cart details whenever user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
      setCartCount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const data = await getCartAPI();
      setCart(data);
      // Calculate total unique items or quantity count
      const totalCount = data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const data = await addToCartAPI(productId, 1, 'increment');
      setCart(data);
      const totalCount = data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      const serverMessage = error?.response?.data?.message || error.message;
      alert(`Failed to add product to cart: ${serverMessage}`);
    }
  };

  const handleUpdateQuantity = async (productId, currentQty, action) => {
    try {
      const data = await addToCartAPI(productId, currentQty, action);
      setCart(data);
      const totalCount = data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const data = await removeFromCartAPI(productId);
      setCart(data);
      const totalCount = data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      const data = await clearCartAPI();
      setCart(data);
      setCartCount(0);
      alert('Cart cleared successfully!');
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart.');
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setCart([]);
    setCartCount(0);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar
          user={user}
          logout={logout}
          cartCount={cartCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <main className="flex-grow">
          <Routes>
            {/* Catalog (Home) */}
            <Route
              path="/"
              element={
                <Home
                  user={user}
                  addToCart={handleAddToCart}
                  searchQuery={searchQuery}
                />
              }
            />

            {/* Cart */}
            <Route
              path="/cart"
              element={
                user ? (
                  <Cart
                    cart={cart}
                    updateQuantity={handleUpdateQuantity}
                    removeFromCart={handleRemoveFromCart}
                    clearCart={handleClearCart}
                    loading={cartLoading}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Checkout */}
            <Route
              path="/checkout"
              element={
                user ? (
                  <Checkout
                    cart={cart}
                    setCart={setCart}
                    setCartCount={setCartCount}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                user && user.role === 'admin' ? (
                  <AdminDashboard user={user} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Auth Pages */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Login setUser={setUser} fetchCart={fetchCart} />
                )
              }
            />
            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Register setUser={setUser} fetchCart={fetchCart} />
                )
              }
            />

            {/* Order Placed Page */}
            <Route
              path="/order-placed"
              element={
                user ? (
                  <OrderPlaced cart={cart} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
