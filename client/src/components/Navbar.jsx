import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, logout, cartCount, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* Library style SVG icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="font-bold text-2xl tracking-tight text-gray-900 font-sans">
                Mini<span className="text-blue-600">Mart</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - only visible on Home page */}
          <div className="flex-1 max-w-md mx-8">
            {location.pathname === '/' ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            ) : null}
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Catalog
            </Link>

            {user && (
              <Link
                to="/cart"
                className={`px-3 py-2 rounded-md text-sm font-medium transition relative flex items-center space-x-1 ${
                  location.pathname === '/cart' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>Cart</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  location.pathname === '/admin' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium border border-red-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
