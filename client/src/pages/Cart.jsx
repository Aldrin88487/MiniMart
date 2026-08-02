import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ cart, updateQuantity, removeFromCart, clearCart, loading }) => {
  const navigate = useNavigate();
  
  // Handle clear cart with confirmation
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      if (item.productId) {
        return acc + item.productId.price * item.quantity;
      }
      return acc;
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-3 text-gray-500 font-medium">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-500 font-semibold text-lg">Your cart is currently empty</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Browse our catalog to add books or items!</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-medium shadow-sm transition"
          >
            Go to Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart items list */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden divide-y divide-gray-100">
            {cart.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
                  {/* Left: Product Info */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md border border-gray-100 bg-gray-50"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{product.name}</h3>
                      <p className="text-xs text-blue-600 font-medium uppercase mt-0.5">{product.category}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Right: Quantity selector & Remove Button */}
                  <div className="flex items-center justify-between sm:justify-end space-x-8 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1, 'decrement')}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-l transition disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-sm font-semibold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1, 'increment')}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-r transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div className="text-right min-w-[70px] hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Total Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider block">
                Total Price
              </span>
              <span className="text-3xl font-extrabold text-gray-900">${calculateTotal()}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                to="/"
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md text-sm font-semibold text-center shadow-xs transition flex-1"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-sm font-semibold text-center shadow-sm transition flex-1"
              >
                Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-sm font-semibold text-center shadow-sm transition flex-1"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
