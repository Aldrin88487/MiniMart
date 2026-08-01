import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrderPlaced = ({ cart }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have cart data to show in the order
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    } else if (cart && cart.length > 0) {
      // If no stored order but cart exists, create order details from cart
      const total = cart.reduce((acc, item) => {
        if (item.productId) {
          return acc + item.productId.price * item.quantity;
        }
        return acc;
      }, 0).toFixed(2);

      setOrderDetails({
        orderId: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
        total: total,
        items: cart
      });
    } else {
      // If no order data, redirect to home after 5 seconds
      setTimeout(() => navigate('/'), 5000);
    }
  }, [cart, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon & Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        {orderDetails && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide mb-1">
                    Order ID
                  </p>
                  <p className="text-2xl font-bold">{orderDetails.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide mb-1">
                    Date & Time
                  </p>
                  <p className="text-sm font-medium">{orderDetails.date} at {orderDetails.time}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-b border-gray-200">
              <div className="p-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">
                    Items
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {orderDetails.itemCount}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">
                    Order Total
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ${orderDetails.total}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Processing
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {orderDetails.items && orderDetails.items.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {item.productId?.name || 'Product'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ${item.productId?.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        ${(item.productId?.price * item.quantity).toFixed(2) || '0.00'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">What's Next?</h4>
              <p className="text-sm text-blue-800">
                You will receive an email confirmation shortly with tracking information. Your order should arrive within 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition shadow-md"
          >
            Continue Shopping
          </Link>
          <Link
            to="/cart"
            className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg text-center transition shadow-sm"
          >
            View Cart
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Order confirmation and tracking info will be sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
