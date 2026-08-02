import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearCartAPI } from '../services/api';

const Checkout = ({ cart, setCart, setCartCount }) => {
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    zip: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      if (item.productId) {
        return acc + item.productId.price * item.quantity;
      }
      return acc;
    }, 0).toFixed(2);
  };

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleCardChange = (e) => {
    let value = e.target.value;
    // Format card number with spaces
    if (e.target.name === 'number') {
      value = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    // Format expiry date with slash
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2').substring(0, 5);
    }
    setCard({ ...card, [e.target.name]: value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!shipping.name.trim()) newErrors.name = 'Full Name is required';
    if (!shipping.email.trim()) newErrors.email = 'Email is required';
    if (!shipping.address.trim()) newErrors.address = 'Address is required';
    if (!shipping.city.trim()) newErrors.city = 'City is required';
    if (!shipping.zip.trim()) newErrors.zip = 'ZIP code is required';

    // Stripe Mock Form validation
    const cleanCard = card.number.replace(/\s/g, '');
    if (cleanCard !== '4242424242424242') {
      newErrors.cardNumber = 'Invalid Card Number. Use 4242 4242 4242 4242 for test payment.';
    }
    if (!card.expiry.trim() || !/^\d{2}\/\d{2}$/.test(card.expiry)) {
      newErrors.cardExpiry = 'Expiry must be MM/YY';
    }
    if (!card.cvc.trim() || card.cvc.length !== 3) {
      newErrors.cardCvc = 'CVC must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      // Simulate Stripe processing delay
      setTimeout(async () => {
        try {
          const total = calculateTotal();

          // Save order to localStorage for the OrderPlaced page
          const orderData = {
            orderId: 'ORD-' + Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
            total: total,
            items: cart,
            shipping: shipping
          };
          localStorage.setItem('lastOrder', JSON.stringify(orderData));

          // Clear cart on backend
          await clearCartAPI();

          // Clear cart local state in App.jsx
          setCart([]);
          setCartCount(0);

          // Redirect to the success page
          navigate('/order-placed');
        } catch (error) {
          console.error('Failed to process checkout:', error);
          alert('Checkout failed during cart synchronization.');
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert('Checkout process failed.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center px-4">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Cannot check out with an empty cart.</p>
        <Link to="/" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-semibold transition">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6 font-mono">
        <Link to="/cart" className="hover:text-blue-600">Cart</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">Stripe Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                1. Shipping Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shipping.name}
                    onChange={handleShippingChange}
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shipping.email}
                    onChange={handleShippingChange}
                    placeholder="john@example.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shipping.address}
                    onChange={handleShippingChange}
                    placeholder="4B,ABC Building, XYZ Street, "
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shipping.city}
                      onChange={handleShippingChange}
                      placeholder="Kottayam"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={shipping.zip}
                      onChange={handleShippingChange}
                      placeholder="686001"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.zip ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Stripe Payment Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm relative">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold text-gray-900">
                  2. Stripe Payment Details
                </h3>
                {/* Secured by Stripe Badge */}
                <div className="flex items-center space-x-1 bg-blue-50 border border-blue-200 rounded px-2 py-1 text-[10px] font-bold text-blue-700 tracking-wide font-mono uppercase">
                  <span>Secured by</span>
                  <span className="font-extrabold italic text-blue-900">stripe</span>
                </div>
              </div>

              {/* Stripe elements emulation box */}
              <div className="space-y-4">
                {/* Credit Card Row */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="number"
                      value={card.number}
                      onChange={handleCardChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength="19"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiration */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={card.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                  </div>

                  {/* CVC */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      name="cvc"
                      value={card.cvc}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength="3"
                      className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${errors.cardCvc ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.cardCvc && <p className="text-red-500 text-xs mt-1">{errors.cardCvc}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-sm font-semibold shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing Stripe Payment...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Pay ${calculateTotal()} via Stripe</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">
              Order Summary
            </h3>

            <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="pr-3">
                    <span className="font-semibold text-gray-900 block line-clamp-1">
                      {item.productId?.name}
                    </span>
                    <span className="text-gray-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900 flex-shrink-0">
                    ${(item.productId?.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4 flex items-center justify-between font-bold text-gray-950 text-base">
              <span>Total:</span>
              <span className="text-xl text-blue-600">${calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
