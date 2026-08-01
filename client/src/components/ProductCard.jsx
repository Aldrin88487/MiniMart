import React from 'react';

const ProductCard = ({ product, onViewDetails, onAddToCart, user }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col h-full">
      {/* Product Image */}
      <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
          }}
        />
        <span className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
          {product.category}
        </span>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1 hover:text-blue-600 transition">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm font-medium transition"
            >
              View Details
            </button>
            <button
              onClick={() => onAddToCart(product._id)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium shadow-sm transition flex items-center justify-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
