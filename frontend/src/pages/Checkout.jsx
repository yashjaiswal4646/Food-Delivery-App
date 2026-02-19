import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { clearCart } from '../store/slices/cartSlice';
import { FaCreditCard, FaMoneyBill, FaMobile } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cart, totalPrice, items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Fixed: Added = operator

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    return Object.values(address).every((field) => field.trim() !== '');
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      toast.error('Please fill in all address fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const orderData = {
        shippingAddress: address,
        paymentMethod,
        itemsPrice: totalPrice,
        taxPrice: totalPrice * 0.1,
        deliveryPrice: totalPrice > 500 ? 0 : 5,
        totalPrice: totalPrice + (totalPrice * 0.1) + (totalPrice > 500 ? 0 : 5),
      };

      const response = await axios.post(`${API_URL}/orders`, orderData, config);

      if (response.data.success) {
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate(`/order/${response.data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = totalPrice > 500 ? 0 : 5;
  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice + tax + deliveryFee;

  if (!items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="py-8 container-custom">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="text-sm">Shipping</span>
            </div>
            <div className={`flex-1 text-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="text-sm">Payment</span>
            </div>
            <div className={`flex-1 text-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="text-sm">Review</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              {step === 1 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={address.state}
                          onChange={handleAddressChange}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={address.zipCode}
                          onChange={handleAddressChange}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={address.country}
                          onChange={handleAddressChange}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 btn-primary"
                    disabled={!validateAddress()}
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <FaMoneyBill className="mr-3 text-2xl text-green-600" />
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <FaCreditCard className="mr-3 text-2xl text-blue-600" />
                      <div>
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <FaMobile className="mr-3 text-2xl text-purple-600" />
                      <div>
                        <span className="font-medium">UPI</span>
                        <p className="text-sm text-gray-500">Pay using Google Pay, PhonePe, etc.</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 btn-outline"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 btn-primary"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold">Review Order</h2>
                  
                  {/* Shipping Address Review */}
                  <div className="mb-6">
                    <h3 className="mb-2 font-semibold">Shipping Address</h3>
                    <p className="text-gray-600">
                      {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
                    </p>
                  </div>

                  {/* Payment Method Review */}
                  <div className="mb-6">
                    <h3 className="mb-2 font-semibold">Payment Method</h3>
                    <p className="text-gray-600">
                      {paymentMethod === 'cod' && 'Cash on Delivery'}
                      {paymentMethod === 'card' && 'Credit/Debit Card'}
                      {paymentMethod === 'upi' && 'UPI'}
                    </p>
                  </div>

                  {/* Order Items Review */}
                  <div className="mb-6">
                    <h3 className="mb-2 font-semibold">Order Items</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 btn-outline"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 btn-primary"
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white rounded-lg shadow-md top-24">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
              
              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">Rs.{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">Rs.{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">Rs.{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">Rs.{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {step === 3 && (
                <div className="mt-4 text-xs text-gray-500">
                  <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;